/*!
 * abcjs-fx.js — Lecteur / éditeur ABC basé sur abcjs (>= 6.x)
 * Version 9.1.1 — https://github.com/fxpar/abcjs-fx — MIT
 *
 * Utilisation :
 *   <textarea data-abcjs-fx options='{"responsive":"resize"}'>X:1 ...</textarea>
 * Anciennes écritures toujours acceptées : data-abcplayer, id="abc_ex_…" (v6–v8),
 * <div class="abcplayer9" data-abc>, window.AbcPlayer9, événement "abcplayer9:render".
 *
 * Attributs reconnus sur le <textarea> (ou data-* sur un <div class="abcjs-fx">) :
 *   mode          editor (défaut) | audio | midi | paper
 *   options       JSON des options abcjs (rendu + synthèse), ex. {"tablature":[...]}
 *   synth-options JSON d'options réservées à la synthèse (program, qpm, soundFontUrl...)
 *   animate       "false" pour désactiver le curseur
 *   chord-diag    "true" pour afficher la liste des accords (ou AbcjsFx.chordDiagramRenderer)
 *   class-paper / class-audio   classes CSS supplémentaires
 *   lang          fr | en (sinon lang de la page)
 *
 * API : window.AbcjsFx.init(racine), .create(config), .players, .pauseAll()
 * Événement : "abcjs-fx:render" (detail: {player, tune, chords}) émis sur le conteneur.
 */
(function (global) {
  "use strict";

  var VERSION = "9.1.1";

  // ---------------------------------------------------------------- i18n
  var I18N = {
    fr: {
      prev: "◀ Précédent", next: "Suivant ▶", tuneN: "Morceau ",
      paperTitle: "Clic : lecture / pause — clic sur une note pendant la lecture : y aller",
      more: "Options", transpose: "Transposition (demi-tons)", swing: "Swing",
      swingNone: "Aucun", swingLight: "Léger", swingTriplet: "Ternaire", swingHard: "Prononcé",
      chordsOff: "Couper les accords", metronome: "Métronome", countIn: "Décompte (1 mesure)",
      source: "Code ABC (modifiable en direct)", midi: "⬇ MIDI", abc: "⬇ ABC",
      book: "⬇ Recueil complet", reset: "↺ Réinitialiser", noAudio: "Audio non supporté par ce navigateur.",
      warnings: "Avertissements", chords: "Accords :", colon: " :",
      voices: "Voix", voice: "Voix", muted: "coupée(s)", allOn: "Tout activer", solo: "Solo",
      soloTitle: "Écouter cette voix seule (re-cliquer : toutes)",
      langName: "Français", language: "Langue", sheet: "Partition",
      // Infobulles de la barre audio d'abcjs (anglaises par défaut)
      repeatTitle: "Jouer une fois / en boucle", restartTitle: "Revenir au début",
      playTitle: "Lecture / pause", randomTitle: "Cliquer pour changer la position de lecture",
      warpTitle: "Vitesse de lecture (%)", bpm: "BPM"
    },
    en: {
      prev: "◀ Previous", next: "Next ▶", tuneN: "Tune ",
      paperTitle: "Click: play / pause — click a note while playing: jump to it",
      more: "Options", transpose: "Transpose (semitones)", swing: "Swing",
      swingNone: "None", swingLight: "Light", swingTriplet: "Triplet", swingHard: "Hard",
      chordsOff: "Chords off", metronome: "Metronome", countIn: "Count-in (1 bar)",
      source: "ABC code (live edit)", midi: "⬇ MIDI", abc: "⬇ ABC",
      book: "⬇ Whole tunebook", reset: "↺ Reset", noAudio: "Audio is not supported by this browser.",
      warnings: "Warnings", chords: "Chords:", colon: ":",
      voices: "Voices", voice: "Voice", muted: "muted", allOn: "Unmute all", solo: "Solo",
      soloTitle: "Listen to this voice alone (click again: all)",
      langName: "English", language: "Language", sheet: "Sheet music",
      repeatTitle: "Play once / loop", restartTitle: "Go to the beginning",
      playTitle: "Play / pause", randomTitle: "Click to change the playback position",
      warpTitle: "Playback speed (%)", bpm: "BPM"
    }
  };

  // ---------------------------------------------------------------- choix de la langue
  var LANG_KEY = "abcjs-fx.lang";
  var OLD_LANG_KEY = "abcplayer9.lang"; // versions précédentes

  function storedLang() {
    try {
      var l = global.localStorage.getItem(LANG_KEY) || global.localStorage.getItem(OLD_LANG_KEY);
      return l && I18N[l] ? l : null;
    } catch (e) { return null; }
  }

  function storeLang(code) {
    try { global.localStorage.setItem(LANG_KEY, code); global.localStorage.removeItem(OLD_LANG_KEY); } catch (e) { /* stockage indisponible */ }
  }

  function supportedLang(value) {
    var code = String(value || "").toLowerCase().slice(0, 2);
    return I18N[code] ? code : null;
  }

  /**
   * Langue de l'interface, par ordre de priorité :
   * 1. choix fait par l'utilisateur dans le menu ⋮ (mémorisé dans le navigateur) ;
   * 2. attribut lang de l'élément lui-même (choix de l'auteur) ;
   * 3. AbcjsFx.defaultLang (réglage du site) ;
   * 4. langues préférées du navigateur ;
   * 5. langue de la page (<html lang>) ;
   * 6. anglais.
   */
  function resolveLang(el) {
    var found = storedLang() || (el && supportedLang(el.getAttribute("lang") || el.getAttribute("data-lang"))) ||
      supportedLang(AbcjsFx.defaultLang);
    if (found) return found;
    var nav = global.navigator || {};
    var prefs = (nav.languages && nav.languages.length ? nav.languages : [nav.language || ""]);
    for (var i = 0; i < prefs.length; i++) { if (supportedLang(prefs[i])) return supportedLang(prefs[i]); }
    var page = el && el.closest && el.closest("[lang]");
    return supportedLang(page && page.getAttribute("lang")) || "en";
  }

  // abcjs attend un pourcentage : 50 = pas de swing, 66 = ternaire, 75 = maximum.
  var SWING_VALUES = [["swingNone", 50], ["swingLight", 58], ["swingTriplet", 66], ["swingHard", 75]];

  var DISPLAY_OPTIONS = { displayLoop: true, displayRestart: true, displayPlay: true, displayProgress: true, displayWarp: true };

  // ---------------------------------------------------------------- CSS
  var CSS = [
    ".abcp{--abcp-accent:#0073aa;--abcp-border:#dee2e6;--abcp-bg:#f8f9fa;--abcp-text:#333;margin-bottom:20px;width:100%;font-family:system-ui,sans-serif;color:var(--abcp-text)}",
    ".abcp *{box-sizing:border-box}",
    ".abcp-nav{display:flex;margin-bottom:10px;align-items:center;gap:8px}",
    ".abcp-nav[hidden]{display:none}",
    ".abcp-nav button,.abcp-actions button{padding:4px 10px;cursor:pointer;background:var(--abcp-bg);border:1px solid #ced4da;border-radius:3px;font-size:13px;color:inherit}",
    ".abcp-nav button:disabled{opacity:.45;cursor:default}",
    ".abcp-nav select{padding:4px;flex:1;max-width:340px;border:1px solid #ced4da;border-radius:3px;font-size:13px}",
    ".abcp-paper{width:100%;cursor:pointer;transition:opacity .2s}",
    ".abcp-paper:hover{opacity:.9}",
    ".abcp-paper:focus-visible{outline:2px solid var(--abcp-accent);outline-offset:2px}",
    ".abcp[data-mode=midi] .abcp-paper{display:none!important}", // abcjs impose un display inline
    ".abcp-bar{display:flex;align-items:center;background:var(--abcp-bg);border:1px solid var(--abcp-border);border-radius:0 0 4px 4px;padding:4px 8px;width:100%}",
    ".abcp[data-mode=midi] .abcp-bar{border-radius:4px}",
    ".abcp-audio{flex:1;min-width:0}",
    ".abcp-audio .abcjs-inline-audio{display:flex!important;align-items:center!important;width:100%!important;gap:8px}",
    ".abcp-audio .abcjs-midi-progress-background{flex:1!important;min-width:50px!important;margin:0 5px!important}",
    ".abcp-toggle{background:none;border:none;font-size:20px;padding:4px 12px;cursor:pointer;color:#6c757d;line-height:1}",
    ".abcp-toggle:hover,.abcp-toggle[aria-expanded=true]{color:var(--abcp-accent)}",
    ".abcp-panel{background:#fff;border:1px solid var(--abcp-border);border-top:none;padding:15px;border-radius:0 0 4px 4px;font-size:13px}",
    ".abcp-panel[hidden]{display:none}",
    ".abcp-row{display:flex;gap:15px;align-items:flex-end;flex-wrap:wrap;margin-bottom:12px}",
    ".abcp-row-end{margin-left:auto}",
    ".abcp-field{display:flex;flex-direction:column;gap:4px}",
    ".abcp-field>span{font-weight:bold}",
    ".abcp-field select{padding:4px 8px;border:1px solid #ccc;border-radius:4px;font-size:13px}",
    ".abcp-check{display:flex;align-items:center;gap:6px;padding-bottom:4px}",
    ".abcp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}",
    ".abcp-editor>span{display:block;font-weight:bold;margin-bottom:4px}",
    ".abcp-textarea{width:100%;height:160px;font-family:ui-monospace,Consolas,monospace;font-size:13px;padding:8px;border:1px solid #ccc;border-radius:4px;resize:vertical;display:block}",
    ".abcp-warnings{margin-top:8px;padding:6px 10px;background:#fff8e1;border:1px solid #ffe08a;border-radius:4px;font-size:12px;white-space:pre-wrap}",
    ".abcp-warnings[hidden]{display:none}",
    ".abcp-voices{margin-top:12px;border-top:1px solid var(--abcp-border);padding-top:8px}",
    ".abcp-voices[hidden]{display:none}",
    ".abcp-voices>summary{cursor:pointer;font-weight:bold;padding:2px 0}",
    ".abcp-voices-actions{margin:8px 0}",
    ".abcp-voices-actions button,.abcp-voice button{padding:2px 8px;cursor:pointer;background:var(--abcp-bg);border:1px solid #ced4da;border-radius:3px;font-size:12px;color:inherit}",
    ".abcp-voice-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 16px;margin:0;padding:0;list-style:none}",
    ".abcp-voice{display:flex;align-items:center;justify-content:space-between;gap:8px}",
    ".abcp-voice label{display:flex;align-items:center;gap:6px;min-width:0}",
    ".abcp-voice label span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".abcp-voice.is-off label span{opacity:.5;text-decoration:line-through}",
    ".abcp-voice button[aria-pressed=true]{background:var(--abcp-accent);border-color:var(--abcp-accent);color:#fff}",
    ".abcp-chords{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;align-items:flex-end}",
    ".abcp-chords:empty{display:none}",
    ".abcp-chip{border:1px solid var(--abcp-border);background:var(--abcp-bg);border-radius:12px;padding:2px 10px;font-size:13px}",
    ".abcp .highlight{fill:#0a9ecc}",
    ".abcp .abcjs-cursor{stroke:red}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("abcjs-fx-style")) return;
    var style = document.createElement("style");
    style.id = "abcjs-fx-style";
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------- utilitaires
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (!attrs.hasOwnProperty(k) || attrs[k] === null || attrs[k] === undefined || attrs[k] === false) continue;
      if (k === "text") el.textContent = attrs[k];
      else if (k === "className") el.className = attrs[k];
      else el.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }

  function parseOptions(raw, where) {
    if (!raw) return {};
    if (typeof raw === "object") return raw;
    try { return JSON.parse(raw); } catch (e) { /* on tente l'ancien format objet JS */ }
    try {
      console.warn("[abcjs-fx] options non JSON sur " + where + " : évaluées comme objet JavaScript (compatibilité v8).");
      return new Function("return (" + raw + ");")() || {};
    } catch (e2) {
      console.error("[abcjs-fx] options illisibles sur " + where, e2);
      return {};
    }
  }

  function stripHtml(s) { return String(s).replace(/<[^>]*>/g, ""); }

  function slug(s) {
    return String(s || "tune").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase() || "tune";
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = h("a", { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  function getTitle(abc, fallback) {
    var m = abc.match(/^T:\s*(.+)$/m);
    return m ? m[1].trim() : fallback;
  }

  /**
   * Découpe un recueil ABC. Les directives d'en-tête de fichier (%%..., champs X:)
   * situées avant le premier X: sont recopiées en tête de chaque morceau.
   */
  function splitTunebook(text, tuneLabel) {
    text = String(text || "").replace(/\r\n?/g, "\n");
    var first = text.search(/^X:/m);
    if (first < 0) {
      var t = text.trim();
      return { header: "", prefix: "", tunes: t ? [{ abc: t, original: t, title: getTitle(t, tuneLabel + 1), auto: !/^T:/m.test(t) }] : [] };
    }
    var header = text.slice(0, first);
    var prefix = header.split("\n").filter(function (l) { return /^(%%|[A-Za-z]:)/.test(l); }).join("\n");
    var tunes = text.slice(first).split(/^(?=X:)/m).map(function (part, i) {
      var body = part.trim();
      var abc = prefix ? prefix + "\n" + body : body;
      return { abc: abc, original: abc, title: getTitle(body, tuneLabel + (i + 1)), auto: !/^T:/m.test(body) };
    }).filter(function (t) { return t.abc; });
    return { header: header.trim(), prefix: prefix, tunes: tunes };
  }

  function chordsIn(abc) {
    var seen = {}, out = [], re = /"([A-G][#b♯♭]?[^"]*)"/g, m;
    var body = abc.replace(/^%.*$/mg, "");
    while ((m = re.exec(body))) {
      var c = m[1].trim();
      if (!seen[c]) { seen[c] = true; out.push(c); }
    }
    return out;
  }

  var SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  var PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  /** Transpose un nom d'accord (fondamentale et basse "/X"). */
  function transposeChord(name, semis) {
    if (!semis) return name;
    var names = semis > 0 ? SHARPS : FLATS;
    return name.replace(/(^|\/)([A-G])([#b♯♭]?)/g, function (all, sep, letter, acc) {
      var n = PC[letter] + (acc === "#" || acc === "♯" ? 1 : acc === "b" || acc === "♭" ? -1 : 0);
      return sep + names[(((n + semis) % 12) + 12) % 12];
    });
  }

  /** Motif de batterie "métronome" calculé depuis la mesure M: du morceau. */
  function metronomeDrum(abc) {
    var num = 4, den = 4, m = abc.match(/^M:\s*(\S+)/m);
    if (m) {
      if (m[1] === "C|") { num = 2; den = 2; }
      else if (m[1] !== "C") {
        var f = m[1].match(/^(\d+)\/(\d+)/);
        if (f) { num = parseInt(f[1], 10); den = parseInt(f[2], 10); }
      }
    }
    var beats = (den === 8 && num % 3 === 0 && num > 3) ? num / 3 : num;
    if (!(beats > 0 && beats < 17)) beats = 4;
    var pitches = [76], vel = [100];
    for (var i = 1; i < beats; i++) { pitches.push(77); vel.push(60); }
    return new Array(beats + 1).join("d") + " " + pitches.join(" ") + " " + vel.join(" ");
  }

  /**
   * Fond blanc derrière les chiffres de tablature : lisibles même quand aucune
   * ligne de corde ne les traverse. Couleur modifiable en CSS : .abcp-tab-bg { fill: ... }
   */
  var SVG_NS = "http://www.w3.org/2000/svg";
  function addTabBackgrounds(container) {
    var sel = "text.abcjs-tab-number, text.abcjs-tab-grace";
    var nums = container.querySelectorAll(sel);
    for (var i = 0; i < nums.length; i++) {
      var text = nums[i];
      if (text.getAttribute("data-abcp-bg")) continue;
      text.setAttribute("data-abcp-bg", "1");
      var box;
      try { box = text.getBBox(); } catch (e) { continue; }
      if (!box.width) continue;
      var rect = document.createElementNS(SVG_NS, "rect");
      rect.setAttribute("class", "abcp-tab-bg");
      rect.setAttribute("x", box.x - 1);
      rect.setAttribute("y", box.y + box.height * 0.15);
      rect.setAttribute("width", box.width + 2);
      rect.setAttribute("height", box.height * 0.7);
      rect.setAttribute("fill", "#fff");
      rect.setAttribute("stroke", "none");
      // Avant le PREMIER chiffre du groupe : dans un accord serré, un fond ne recouvre
      // jamais le chiffre de la corde voisine.
      var first = text;
      for (var s = text.previousElementSibling; s; s = s.previousElementSibling) {
        if (s.matches(sel)) first = s;
      }
      text.parentNode.insertBefore(rect, first);
    }
  }

  // ---------------------------------------------------------------- curseur
  // Toujours fourni à abcjs, même sans animation : c'est lui qui porte
  // extraMeasuresAtBeginning (décalage du curseur et des temps de notes pendant le décompte).
  function CursorControl(paperEl, animate) {
    var self = this;
    self.extraMeasuresAtBeginning = 0;
    if (!animate) {
      self.beatSubdivisions = 2;
      self.onStart = self.onEvent = self.onFinished = function () {};
      return;
    }
    function clear() {
      var els = paperEl.querySelectorAll("svg .highlight");
      for (var i = 0; i < els.length; i++) els[i].classList.remove("highlight");
    }
    self.beatSubdivisions = 2;
    self.onStart = function () {
      var svg = paperEl.querySelector("svg");
      if (!svg || svg.querySelector(".abcjs-cursor")) return;
      var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cursor.setAttribute("class", "abcjs-cursor");
      ["x1", "y1", "x2", "y2"].forEach(function (a) { cursor.setAttribute(a, 0); });
      svg.appendChild(cursor);
    };
    self.onEvent = function (ev) {
      if (ev.measureStart && ev.left === null) return;
      clear();
      for (var i = 0; i < ev.elements.length; i++)
        for (var j = 0; j < ev.elements[i].length; j++) ev.elements[i][j].classList.add("highlight");
      var cursor = paperEl.querySelector("svg .abcjs-cursor");
      if (cursor) {
        cursor.setAttribute("x1", ev.left - 2); cursor.setAttribute("x2", ev.left - 2);
        cursor.setAttribute("y1", ev.top); cursor.setAttribute("y2", ev.top + ev.height);
      }
    };
    self.onFinished = function () {
      clear();
      var cursor = paperEl.querySelector("svg .abcjs-cursor");
      if (cursor) ["x1", "y1", "x2", "y2"].forEach(function (a) { cursor.setAttribute(a, 0); });
    };
  }

  // ---------------------------------------------------------------- lecteur
  var players = [];
  var counter = 0;

  function Player(cfg) {
    this.cfg = cfg;
    this.id = cfg.id || ("abcp" + (++counter));
    this.mode = /^(editor|audio|midi|paper)$/.test(cfg.mode) ? cfg.mode : "editor";
    // Langue : choix mémorisé > langue demandée > réglage du site > navigateur > page > anglais
    this.lang = storedLang() || supportedLang(cfg.lang) || resolveLang(cfg.el || cfg.before || cfg.container || null);
    this.t = I18N[this.lang];
    this._tr = []; // éléments traduits : retraduits à chaud par setLanguage()
    this.options = Object.assign({}, cfg.options);
    // Les classes SVG (dont abcjs-tab-number) servent au fond blanc des chiffres de tab
    if (this.options.tablature && this.options.add_classes === undefined) this.options.add_classes = true;
    // Extensions (ex. abcjs-fx-diagrams.js) : peuvent ajuster les options avant le premier rendu
    var self0 = this;
    AbcjsFx.plugins.forEach(function (p) { if (p.configure) p.configure(self0, cfg); });
    this.synthOptions = cfg.synthOptions || {};
    var book = splitTunebook(cfg.abc, this.t.tuneN);
    this.book = book;
    this.tunes = book.tunes.length ? book.tunes : [{ abc: "", original: "", title: this.t.tuneN + 1 }];
    this.current = 0;
    this.state = this.defaultState();
    this.noteClickAt = 0;
    this.build();
    // Monté dans la page AVANT le premier rendu (mise en page responsive correcte)
    if (cfg.before) cfg.before.parentNode.insertBefore(this.root, cfg.before);
    else if (cfg.container) cfg.container.appendChild(this.root);
    if (this.mode === "paper") this.renderPaperOnly();
    else this.startEditor();
    players.push(this);
  }

  Player.prototype.defaultState = function () {
    var o = Object.assign({}, this.options, this.synthOptions);
    return {
      transpose: 0,
      swing: parseFloat(o.swing) > 50 ? parseFloat(o.swing) : 50,
      chordsOff: o.chordsOff === true || o.chordsOff === "true",
      metronome: false,
      countIn: false,
      // Voix coupées, repérées par leur nom : le choix suit d'un morceau à l'autre du recueil
      muted: {}
    };
  };

  /**
   * Enregistre un élément traduisible. `key` : clé de I18N ou fonction (t) -> texte ;
   * `attr` : attribut à remplir (sinon textContent).
   */
  Player.prototype.tr = function (el, key, attr) {
    this._tr.push({ el: el, key: key, attr: attr });
    this.applyTr(this._tr[this._tr.length - 1]);
    return el;
  };

  Player.prototype.applyTr = function (item) {
    var value = typeof item.key === "function" ? item.key(this.t) : this.t[item.key];
    if (item.attr) item.el.setAttribute(item.attr, value);
    else item.el.textContent = value;
  };

  Player.prototype.build = function () {
    var self = this, t = this.t, id = this.id, cfg = this.cfg;
    var tr = this.tr.bind(this);

    this.root = h("div", { className: "abcp " + (cfg.className || ""), "data-mode": this.mode, id: id, lang: this.lang });

    // Navigation recueil (options remplies par refreshTuneList)
    this.selectEl = tr(h("select"), "tuneN", "aria-label");
    this.prevBtn = tr(h("button", { type: "button" }), "prev");
    this.nextBtn = tr(h("button", { type: "button" }), "next");
    this.navEl = h("div", { className: "abcp-nav", hidden: true }, [this.prevBtn, this.selectEl, this.nextBtn]);
    this.root.appendChild(this.navEl);

    this.chordsEl = cfg.chordDiag ? h("div", { className: "abcp-chords abcjs-chord-diagrams" }) : null;
    if (this.chordsEl) this.root.appendChild(this.chordsEl);

    this.paperEl = h("div", {
      className: "abcp-paper " + (cfg.classPaper || ""), id: id + "-paper",
      tabindex: this.mode === "paper" ? null : "0"
    });
    if (this.mode !== "paper") tr(this.paperEl, "paperTitle", "title");
    this.root.appendChild(this.paperEl);
    if (this.mode === "paper") { this.refreshTuneList(); return; }

    // Barre audio + bouton options
    this.audioEl = h("div", { className: "abcp-audio " + (cfg.classAudio || ""), id: id + "-audio" });
    this.toggleBtn = tr(h("button", {
      type: "button", className: "abcp-toggle", "aria-expanded": "false",
      "aria-controls": id + "-panel", text: "⋮"
    }), "more", "title");
    this.root.appendChild(h("div", { className: "abcp-bar" }, [this.audioEl, this.toggleBtn]));

    // Panneau d'options
    this.transposeEl = h("select", { id: id + "-tr" });
    for (var s = -12; s <= 12; s++) {
      this.transposeEl.appendChild(h("option", { value: s, text: (s > 0 ? "+" : "") + s, selected: s === 0 }));
    }
    this.swingEl = h("select", { id: id + "-sw" });
    SWING_VALUES.forEach(function (sv) {
      self.swingEl.appendChild(tr(h("option", { value: sv[1] }), function (tt) {
        return tt[sv[0]] + (sv[1] > 50 ? " (" + sv[1] + "%)" : "");
      }));
    });
    this.chordsOffEl = h("input", { type: "checkbox" });
    this.metronomeEl = h("input", { type: "checkbox" });
    this.countInEl = h("input", { type: "checkbox" });

    // Langue de l'interface : toutes les langues de AbcjsFx.i18n
    this.langEl = h("select", { id: id + "-lang" });
    Object.keys(I18N).forEach(function (code) {
      self.langEl.appendChild(h("option", { value: code, text: I18N[code].langName || code, selected: code === self.lang }));
    });

    function field(key, ctrl) { return h("label", { className: "abcp-field" }, [tr(h("span"), key), ctrl]); }
    function check(key, ctrl) { return h("label", { className: "abcp-check" }, [ctrl, tr(h("span"), key)]); }

    this.midiBtn = tr(h("button", { type: "button" }), "midi");
    this.abcBtn = tr(h("button", { type: "button" }), "abc");
    this.bookBtn = tr(h("button", { type: "button", hidden: true }), "book");
    this.resetBtn = tr(h("button", { type: "button" }), "reset");

    this.panelEl = h("div", { className: "abcp-panel", id: id + "-panel", hidden: true }, [
      h("div", { className: "abcp-row" }, [
        field("transpose", this.transposeEl),
        field("swing", this.swingEl),
        check("chordsOff", this.chordsOffEl),
        check("metronome", this.metronomeEl),
        check("countIn", this.countInEl),
        h("span", { className: "abcp-row-end" }),
        field("language", this.langEl)
      ]),
      h("div", { className: "abcp-actions" }, [this.midiBtn, this.abcBtn, this.bookBtn, this.resetBtn])
    ]);

    // Zone d'édition : on réutilise le textarea d'origine s'il existe (compatibilité v8)
    var ta = cfg.textarea || h("textarea");
    ta.className = "abcp-textarea";
    ta.setAttribute("spellcheck", "false");
    ta.removeAttribute("style");
    this.textarea = ta;
    this.warningsEl = h("div", { className: "abcp-warnings", hidden: true, role: "status" });
    var editorBox = h("label", { className: "abcp-editor", hidden: this.mode !== "editor" },
      [tr(h("span"), "source"), ta]);
    this.panelEl.appendChild(editorBox);
    this.panelEl.appendChild(this.warningsEl);

    // Accordéon des voix, en bas du panneau (rempli après chaque rendu)
    this.voicesSummary = h("summary");
    this.voicesEl = h("details", { className: "abcp-voices", hidden: true }, [this.voicesSummary]);
    this.panelEl.appendChild(this.voicesEl);

    this.root.appendChild(this.panelEl);
    this.refreshTuneList();
  };

  /** (Re)construit la liste déroulante du recueil : au départ et après un collage de plusieurs morceaux. */
  Player.prototype.refreshTuneList = function () {
    var self = this;
    this.selectEl.textContent = "";
    this.tunes.forEach(function (tune, i) {
      self.selectEl.appendChild(h("option", { value: i, text: (i + 1) + ". " + tune.title }));
    });
    var several = this.tunes.length > 1;
    this.navEl.hidden = !several || this.mode === "paper";
    if (this.bookBtn) this.bookBtn.hidden = !several;
    if (this.prevBtn) this.updateNav();
  };

  /**
   * Voix du morceau courant, dans l'ordre utilisé par abcjs pour voicesOff
   * (portée par portée en sautant les tablatures, puis voix par voix).
   */
  Player.prototype.voiceList = function () {
    var abc = this.tunes[this.current].abc;
    if (this._voiceCache && this._voiceCache.abc === abc) return this._voiceCache.list;
    var list = [], t = this.t;
    try {
      var tune = ABCJS.parseOnly(abc)[0];
      var best = null;
      (tune ? tune.lines : []).forEach(function (line) {
        if (!line.staff) return;
        var n = line.staff.reduce(function (s, st) { return s + (st.clef && st.clef.type === "TAB" ? 0 : st.voices.length); }, 0);
        if (!best || n > best.n) best = { line: line, n: n };
      });
      if (best) {
        var staffNo = 0;
        best.line.staff.forEach(function (st) {
          if (st.clef && st.clef.type === "TAB") return;
          staffNo++;
          var titles = st.title || [];
          var base = (titles[0] || "").trim() || t.voice + " " + staffNo;
          for (var k = 0; k < st.voices.length; k++) {
            var own = (titles[k] || "").trim();
            var label = st.voices.length > 1 ? (k > 0 && own ? own : base + " (" + (k + 1) + ")") : (own || base);
            // Noms en double : on numérote pour garder des clés distinctes
            var unique = label, n2 = 2;
            while (list.indexOf(unique) >= 0) unique = label + " #" + (n2++);
            list.push(unique);
          }
        });
      }
    } catch (e) { list = []; }
    this._voiceCache = { abc: abc, list: list };
    return list;
  };

  Player.prototype.renderVoices = function () {
    if (!this.voicesEl) return;
    var self = this, t = this.t, list = this.voiceList(), muted = this.state.muted;
    this.voicesEl.hidden = list.length < 2;
    if (list.length < 2) return;
    var key = list.join("\n");
    if (this._voicesKey !== key) {
      this._voicesKey = key;
      // Conserve l'état ouvert/fermé de l'accordéon
      while (this.voicesEl.lastChild !== this.voicesSummary) this.voicesEl.removeChild(this.voicesEl.lastChild);
      var allOn = h("button", { type: "button", text: t.allOn });
      allOn.addEventListener("click", function () { self.state.muted = {}; self.applyVoices(); });
      this.voicesEl.appendChild(h("div", { className: "abcp-voices-actions" }, [allOn]));
      var ul = h("ul", { className: "abcp-voice-list" });
      this.voiceRows = list.map(function (name) {
        var cb = h("input", { type: "checkbox" });
        var solo = h("button", { type: "button", text: t.solo, title: t.soloTitle, "aria-pressed": "false" });
        var li = h("li", { className: "abcp-voice" }, [h("label", { title: name }, [cb, h("span", { text: name })]), solo]);
        cb.addEventListener("change", function () {
          if (cb.checked) delete self.state.muted[name]; else self.state.muted[name] = true;
          self.applyVoices();
        });
        solo.addEventListener("click", function () {
          var others = self.voiceList().filter(function (v) { return v !== name; });
          var isSolo = !self.state.muted[name] && others.every(function (v) { return self.state.muted[v]; });
          self.state.muted = {};
          if (!isSolo) others.forEach(function (v) { self.state.muted[v] = true; });
          self.applyVoices();
        });
        ul.appendChild(li);
        return { name: name, li: li, cb: cb, solo: solo };
      });
      this.voicesEl.appendChild(ul);
    }
    var off = list.filter(function (v) { return muted[v]; });
    this.voiceRows.forEach(function (r) {
      var on = !muted[r.name];
      r.cb.checked = on;
      r.li.classList.toggle("is-off", !on);
      r.solo.setAttribute("aria-pressed", String(on && off.length === list.length - 1));
    });
    this.voicesSummary.textContent = t.voices + " (" + list.length + ")" + (off.length ? " — " + off.length + " " + t.muted : "");
  };

  Player.prototype.applyVoices = function () {
    this.pause();
    this.editor.synthParamChanged(this.synthParams());
  };

  // ---- Mode "paper" : simple rendu de toutes les partitions
  Player.prototype.renderPaperOnly = function () {
    var self = this;
    var divs = this.tunes.map(function () {
      var d = h("div", { className: "abcp-tune" });
      self.paperEl.appendChild(d);
      return d;
    });
    var all = this.tunes.map(function (x) { return x.abc; }).join("\n\n");
    var params = Object.assign({ responsive: "resize" }, this.options);
    this.visualObjs = ABCJS.renderAbc(divs, all, params);
    addTabBackgrounds(this.paperEl);
    this.emitRender();
  };

  // ---- Modes editor / audio / midi : ABCJS.Editor + synthé
  Player.prototype.renderParams = function () {
    return Object.assign({ responsive: "resize" }, this.options, { visualTranspose: this.state.transpose });
  };

  Player.prototype.synthParams = function () {
    var st = this.state;
    var p = Object.assign({}, DISPLAY_OPTIONS, this.audioLabels(), this.options, this.synthOptions, {
      midiTranspose: st.transpose, chordsOff: st.chordsOff, swing: st.swing
    });
    if (st.metronome || st.countIn) {
      p.drum = metronomeDrum(this.tunes[this.current].abc);
      p.drumBars = 1;
      p.drumIntro = st.countIn ? 1 : 0;
      p.drumOff = !st.metronome; // décompte seul : la batterie s'arrête après l'intro
    }
    // Voix coupées -> indices attendus par abcjs
    var off = [];
    this.voiceList().forEach(function (name, i) { if (st.muted[name]) off.push(i); });
    if (off.length) p.voicesOff = off;
    // abcjs ajoute la mesure de décompte au MIDI mais pas au curseur : sans ce réglage,
    // le curseur part pendant le décompte et garde une mesure d'avance sur le son.
    if (this.cursor) this.cursor.extraMeasuresAtBeginning = st.countIn ? 1 : 0;
    return p;
  };

  Player.prototype.startEditor = function () {
    var self = this;
    this.setText(this.tunes[0].abc);

    if (!ABCJS.synth || !ABCJS.synth.supportsAudio()) {
      this.tr(this.audioEl, "noAudio");
    }

    var params = this.renderParams();
    params.clickListener = function (abcelem) { self.onNoteClick(abcelem); };
    this.cursor = new CursorControl(this.paperEl, this.cfg.animate !== false);

    this.editor = new ABCJS.Editor(this.textarea, {
      canvas_id: this.paperEl,
      abcjsParams: params,
      synth: {
        el: this.audioEl,
        cursorControl: this.cursor,
        options: this.synthParams()
      },
      redrawCallback: function (starting) { if (!starting) self.afterRender(); }
    });
    // Le constructeur d'Editor rend avant que redrawCallback ne soit branché sur certaines versions
    this.afterRender();

    if (!global.abcEditors) global.abcEditors = [];
    global.abcEditors.push(this.editor); // compatibilité v8 ("Master Control")

    this.bindEvents();
    this.updateNav();
  };

  /** Remplace le texte ; curseur au début pour qu'abcjs ne surligne pas la dernière barre en rouge. */
  Player.prototype.setText = function (abc) {
    this.textarea.value = abc;
    try { this.textarea.setSelectionRange(0, 0); } catch (e) { /* textarea non affiché */ }
  };

  Player.prototype.synthControl = function () {
    return this.editor && this.editor.synth && this.editor.synth.synthControl;
  };

  /** Durée (s) avant la première note : la mesure de décompte, anacrouse déduite. */
  Player.prototype.introSeconds = function () {
    var sc = this.synthControl(), timings = sc && sc.timer && sc.timer.noteTimings;
    if (!timings) return 0;
    for (var i = 0; i < timings.length; i++) {
      if (timings[i].type === "event") return timings[i].milliseconds / 1000;
    }
    return 0;
  };

  /**
   * En boucle, abcjs relance le MIDI depuis 0 et rejoue donc le décompte à chaque tour.
   * On remplace sa fonction de fin pour reprendre directement après le décompte.
   */
  Player.prototype.patchLoop = function () {
    var self = this, sc = this.synthControl();
    if (!sc || sc.abcp9LoopPatched) return;
    sc.abcp9LoopPatched = true;
    var original = sc.finished;
    sc.finished = function () {
      var intro = self.state.countIn ? self.introSeconds() : 0;
      if (!sc.isLooping || !intro || !sc.timer || !sc.midiBuffer) return original.apply(this, arguments);
      sc.timer.reset();
      sc.timer.start(intro, "seconds");
      sc.midiBuffer.finished();
      sc.midiBuffer.pausedTimeSec = intro; // start() reprend à pausedTimeSec
      sc.midiBuffer.start();
      return "continue";
    };
  };

  Player.prototype.isPlaying = function () {
    var sc = this.synthControl();
    return !!(sc && sc.isStarted);
  };

  /** Bascule lecture/pause en passant par le bouton abcjs (gère l'init audio). */
  Player.prototype.togglePlay = function () {
    var btn = this.audioEl && this.audioEl.querySelector(".abcjs-midi-start");
    if (btn) btn.click();
  };

  Player.prototype.pause = function () {
    if (this.isPlaying()) this.togglePlay();
  };

  Player.prototype.onNoteClick = function (abcelem) {
    this.noteClickAt = Date.now();
    var self = this;
    function msOf() {
      var ms = abcelem && abcelem.currentTrackMilliseconds;
      return Array.isArray(ms) ? ms[0] : ms;
    }
    function seek() {
      var ms = msOf(), sc = self.synthControl();
      if (typeof ms === "number" && sc) {
        try { sc.seek(ms / 1000, "seconds"); } catch (e) { console.warn("[abcjs-fx] seek", e); }
      }
    }
    if (this.isPlaying()) { seek(); return; }
    // À l'arrêt : en mode éditeur, le clic sert à sélectionner le code ; sinon on joue depuis la note.
    if (this.mode !== "editor") {
      this.togglePlay();
      setTimeout(seek, 150);
    }
  };

  Player.prototype.afterRender = function () {
    var ed = this.editor;
    if (!ed) return;
    this.patchLoop();
    addTabBackgrounds(this.paperEl);
    var warnings = (ed.tunes && ed.tunes[0] && ed.tunes[0].warnings) || [];
    if (warnings.length) {
      this.warningsEl.textContent = this.t.warnings + " :\n" + warnings.map(stripHtml).join("\n");
      this.warningsEl.hidden = false;
    } else {
      this.warningsEl.hidden = true;
    }
    this.renderVoices();
    this.localizeAudioBar();
    this.emitRender();
  };

  /** Libellés de la barre audio d'abcjs (options reconnues par SynthController). */
  Player.prototype.audioLabels = function () {
    var t = this.t;
    return {
      repeatTitle: t.repeatTitle, restartTitle: t.restartTitle, playTitle: t.playTitle,
      randomTitle: t.randomTitle, warpTitle: t.warpTitle, bpm: t.bpm
    };
  };

  /**
   * abcjs ne construit sa barre audio qu'une fois : on met ses infobulles à jour directement,
   * ce qui permet aussi de changer de langue sans recharger.
   */
  Player.prototype.localizeAudioBar = function () {
    if (!this.audioEl) return;
    var t = this.t, el = this.audioEl;
    [[".abcjs-midi-loop", "repeatTitle"], [".abcjs-midi-reset", "restartTitle"], [".abcjs-midi-start", "playTitle"],
      [".abcjs-midi-progress-background", "randomTitle"], [".abcjs-midi-tempo", "warpTitle"]].forEach(function (pair) {
      var b = el.querySelector(pair[0]);
      if (b) { b.setAttribute("title", t[pair[1]]); b.setAttribute("aria-label", t[pair[1]]); }
    });
    var tempo = el.querySelector(".abcjs-midi-current-tempo");
    if (tempo && tempo.nextSibling && tempo.nextSibling.nodeType === 3) tempo.nextSibling.nodeValue = " " + t.bpm + ")";
  };

  /** Titre (infobulle) et nom accessible de la partition SVG : "Sheet Music for …" chez abcjs. */
  Player.prototype.localizeSheetTitle = function () {
    var t = this.t, self = this;
    Array.prototype.forEach.call(this.paperEl.querySelectorAll("svg"), function (svg, i) {
      var titleEl = svg.querySelector(":scope > title");
      var tuneTitle = self.mode === "paper" ? (self.tunes[i] && self.tunes[i].title) : self.tunes[self.current].title;
      var text = t.sheet + (tuneTitle ? " — " + tuneTitle : "");
      if (titleEl) titleEl.textContent = text;
      if (svg.hasAttribute("aria-label")) svg.setAttribute("aria-label", text);
    });
  };

  /** Change la langue de ce lecteur, sans le reconstruire (état et lecture conservés). */
  Player.prototype.setLanguage = function (code) {
    if (!I18N[code]) return;
    var self = this;
    this.lang = code;
    this.t = I18N[code];
    this.root.setAttribute("lang", code);
    this._tr.forEach(function (item) { self.applyTr(item); });
    if (this.langEl) this.langEl.value = code;
    // Titres automatiques ("Morceau 2" / "Tune 2") des morceaux sans T:
    this.tunes.forEach(function (tune, i) { if (tune.auto) tune.title = self.t.tuneN + (i + 1); });
    this.refreshTuneList();
    this._voicesKey = null;  // reconstruit l'accordéon des voix dans la nouvelle langue
    this._voiceCache = null; // noms par défaut ("Voix 1" / "Voice 1") recalculés
    if (this.editor) this.afterRender(); else this.emitRender();
  };

  Player.prototype.emitRender = function () {
    this.localizeSheetTitle();
    var tune = this.mode === "paper" ? this.visualObjs : (this.editor && this.editor.tunes[0]);
    var abc = this.tunes[this.current].abc;
    var semis = this.state.transpose;
    var chords = chordsIn(abc).map(function (c) { return transposeChord(c, semis); });
    if (this.chordsEl) {
      if (typeof AbcjsFx.chordDiagramRenderer === "function") {
        AbcjsFx.chordDiagramRenderer(this.chordsEl, chords, this);
      } else {
        var el = this.chordsEl;
        el.textContent = "";
        if (chords.length) {
          el.appendChild(h("span", { text: this.t.chords }));
          chords.forEach(function (c) { el.appendChild(h("span", { className: "abcp-chip", text: c })); });
        }
      }
    }
    var self = this;
    AbcjsFx.plugins.forEach(function (p) { if (p.afterRender) p.afterRender(self); });
    var detail = { player: this, tune: tune, chords: chords };
    this.root.dispatchEvent(new CustomEvent("abcjs-fx:render", { bubbles: true, detail: detail }));
    this.root.dispatchEvent(new CustomEvent("abcplayer9:render", { bubbles: true, detail: detail })); // ancien nom
  };

  Player.prototype.applySettings = function () {
    var st = this.state;
    st.transpose = parseInt(this.transposeEl.value, 10) || 0;
    st.swing = parseFloat(this.swingEl.value) || 50;
    st.chordsOff = this.chordsOffEl.checked;
    st.metronome = this.metronomeEl.checked;
    st.countIn = this.countInEl.checked;
    this.pause();
    // paramChanged + synthParamChanged déclenchent un seul rendu (temporisé par abcjs).
    this.editor.paramChanged({ visualTranspose: st.transpose });
    this.editor.synthParamChanged(this.synthParams());
  };

  Player.prototype.syncControls = function () {
    var st = this.state;
    this.transposeEl.value = st.transpose;
    this.swingEl.value = SWING_VALUES.some(function (s) { return s[1] === st.swing; }) ? st.swing : 50;
    this.chordsOffEl.checked = st.chordsOff;
    this.metronomeEl.checked = st.metronome;
    this.countInEl.checked = st.countIn;
  };

  Player.prototype.loadTune = function (index) {
    if (index < 0 || index >= this.tunes.length || index === this.current) return;
    this.pause();
    this.current = index;
    this.setText(this.tunes[index].abc);
    // Les réglages (transposition, swing...) sont conservés d'un morceau à l'autre ;
    // le métronome dépend de la mesure du morceau, on le recalcule.
    this.editor.synthParamChanged(this.synthParams());
    this.updateNav();
  };

  /**
   * Le textarea contient plusieurs morceaux après un collage : le morceau courant est
   * remplacé par les morceaux collés, et la liste déroulante est reconstruite.
   * @return {boolean} true si un découpage a eu lieu
   */
  Player.prototype.splitPasted = function () {
    var text = this.textarea.value;
    if ((text.match(/^X:/mg) || []).length < 2) return false;
    var parsed = splitTunebook(text, this.t.tuneN).tunes;
    if (parsed.length < 2) return false;
    this.pause();
    Array.prototype.splice.apply(this.tunes, [this.current, 1].concat(parsed));
    this.setText(this.tunes[this.current].abc);
    this.refreshTuneList();
    this.editor.synthParamChanged(this.synthParams()); // nouveau rendu (métronome, voix recalculés)
    return true;
  };

  Player.prototype.updateNav = function () {
    this.selectEl.value = this.current;
    this.prevBtn.disabled = this.current === 0;
    this.nextBtn.disabled = this.current === this.tunes.length - 1;
  };

  Player.prototype.bindEvents = function () {
    var self = this;

    this.toggleBtn.addEventListener("click", function () {
      var open = self.panelEl.hidden;
      self.panelEl.hidden = !open;
      self.toggleBtn.setAttribute("aria-expanded", String(open));
      self.toggleBtn.textContent = open ? "✕" : "⋮";
    });

    this.selectEl.addEventListener("change", function () { self.loadTune(parseInt(this.value, 10)); });
    // Langue : s'applique à tous les lecteurs de la page et est mémorisée dans le navigateur
    this.langEl.addEventListener("change", function () { AbcjsFx.setLanguage(this.value); });
    this.prevBtn.addEventListener("click", function () { self.loadTune(self.current - 1); });
    this.nextBtn.addEventListener("click", function () { self.loadTune(self.current + 1); });

    // Réglages appliqués immédiatement (plus besoin du bouton "Mettre à jour")
    [this.transposeEl, this.swingEl, this.chordsOffEl, this.metronomeEl, this.countInEl].forEach(function (el) {
      el.addEventListener("change", function () { self.applySettings(); });
    });

    // Les modifications du code sont mémorisées par morceau (non perdues en changeant de morceau)
    this.textarea.addEventListener("input", function (e) {
      // Collage de plusieurs morceaux (plusieurs X:) : ils rejoignent le recueil
      if (/^insertFrom(Paste|Drop)/.test(e.inputType || "") && self.splitPasted()) return;
      var tune = self.tunes[self.current];
      tune.abc = self.textarea.value;
      var prefix = self.book.prefix;
      var body = prefix && tune.abc.indexOf(prefix) === 0 ? tune.abc.slice(prefix.length) : tune.abc;
      var title = getTitle(body, tune.title);
      if (title !== tune.title) {
        tune.title = title;
        self.selectEl.options[self.current].textContent = (self.current + 1) + ". " + title;
      }
      // abcjs n'écoute que le clavier (keyup) : un collage à la souris ne redessinait rien
      self.editor.fireChanged();
    });

    this.midiBtn.addEventListener("click", function () { self.downloadMidi(); });
    this.abcBtn.addEventListener("click", function () {
      var tune = self.tunes[self.current];
      download(new Blob([tune.abc + "\n"], { type: "text/vnd.abc;charset=utf-8" }), slug(tune.title) + ".abc");
    });
    if (this.bookBtn) this.bookBtn.addEventListener("click", function () {
      var prefix = self.book.prefix;
      var parts = self.tunes.map(function (x) {
        return prefix && x.abc.indexOf(prefix + "\n") === 0 ? x.abc.slice(prefix.length + 1) : x.abc;
      });
      var txt = (self.book.header ? self.book.header + "\n\n" : "") + parts.join("\n\n") + "\n";
      download(new Blob([txt], { type: "text/vnd.abc;charset=utf-8" }), slug(self.tunes[0].title) + "_recueil.abc");
    });
    this.resetBtn.addEventListener("click", function () {
      var tune = self.tunes[self.current];
      tune.abc = tune.original;
      self.setText(tune.original);
      self.state = self.defaultState();
      self.syncControls();
      self.applySettings();
    });

    // Lecture exclusive : démarrer un lecteur met les autres en pause
    this.audioEl.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".abcjs-midi-start") && !self.isPlaying()) {
        AbcjsFx.pauseAll(self);
      }
    }, true);

    // Clic sur la partition (hors note) : lecture / pause
    this.paperEl.addEventListener("click", function () {
      if (Date.now() - self.noteClickAt < 400) return;
      self.togglePlay();
    });
    // Clavier : Espace / Entrée sur la partition
    this.paperEl.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); self.togglePlay(); }
    });

    this.syncControls();
  };

  Player.prototype.downloadMidi = function () {
    var tune = this.editor && this.editor.tunes[0];
    if (!tune) return;
    var p = this.synthParams();
    p.midiOutputType = "binary";
    try {
      var bytes = ABCJS.synth.getMidiFile(tune, p);
      if (Array.isArray(bytes)) bytes = bytes[0];
      download(new Blob([bytes], { type: "audio/midi" }), slug(this.tunes[this.current].title) + ".mid");
    } catch (e) {
      console.error("[abcjs-fx] export MIDI", e);
    }
  };

  // ---------------------------------------------------------------- auto-initialisation
  function attr(el, name) {
    var v = el.getAttribute(name);
    return v === null ? el.getAttribute("data-" + name) : v;
  }

  function configFrom(el) {
    var isTextarea = el.tagName === "TEXTAREA";
    var abc = isTextarea ? el.value : "";
    if (!isTextarea) {
      var raw = el.getAttribute("data-abc");
      try { abc = raw ? JSON.parse(raw) : el.textContent; } catch (e) { abc = raw; }
    }
    return {
      id: el.id ? "abcp-" + el.id : null,
      abc: abc,
      mode: attr(el, "mode") || "editor",
      options: parseOptions(attr(el, "options"), "#" + el.id),
      synthOptions: parseOptions(attr(el, "synth-options"), "#" + el.id),
      animate: attr(el, "animate") !== "false",
      chordDiag: attr(el, "chord-diag") === "true",
      classPaper: attr(el, "class-paper"),
      classAudio: attr(el, "class-audio"),
      className: isTextarea ? "" : el.className,
      lang: resolveLang(el),
      textarea: isTextarea ? el : null,
      el: el, // élément source : les extensions y lisent leurs propres attributs
      attr: function (name) { return attr(el, name); }
    };
  }

  // Éléments transformés en lecteurs ; les anciennes écritures restent acceptées
  var SELECTOR = 'textarea[data-abcjs-fx], .abcjs-fx[data-abc], ' +
    'textarea[data-abcplayer], .abcplayer9[data-abc], textarea[id^="abc_ex_"]';

  function init(root) {
    if (typeof ABCJS === "undefined") {
      console.error("[abcjs-fx] ABCJS n'est pas chargé : incluez abcjs-basic.js avant abcjs-fx.js");
      return [];
    }
    injectCss();
    // Patch facultatif des tablatures (accordages rentrants), s'il est chargé
    if (global.AbcjsReentrantTab && !global.AbcjsReentrantTab.installed) global.AbcjsReentrantTab.install(ABCJS);
    root = root || document;
    var created = [];
    var nodes = root.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.getAttribute("data-abcp-ready")) return;
      el.setAttribute("data-abcp-ready", "1");
      try {
        var cfg = configFrom(el);
        // Le textarea d'origine est déplacé dans le panneau : on garde sa place avec un repère
        var anchor = document.createComment("abcjs-fx");
        el.parentNode.insertBefore(anchor, el);
        cfg.before = anchor;
        var player = new Player(cfg);
        anchor.remove();
        if (!cfg.textarea || player.mode === "paper") el.hidden = true;
        created.push(player);
      } catch (e) {
        console.error("[abcjs-fx] initialisation impossible pour", el, e);
      }
    });
    return created;
  }

  var AbcjsFx = {
    version: VERSION,
    init: init,
    create: function (cfg) { injectCss(); return new Player(cfg); },
    players: players,
    pauseAll: function (except) { players.forEach(function (p) { if (p !== except && p.pause) p.pause(); }); },
    splitTunebook: splitTunebook,
    transposeChord: transposeChord,
    chordDiagramRenderer: null,
    /** Extensions : { configure(player, cfg), afterRender(player) } */
    plugins: [],
    i18n: I18N,
    /** Langue par défaut imposée par le site (avant celle du navigateur), ex. "fr". */
    defaultLang: null,
    /** Langue d'un nouvel élément, selon l'ordre de priorité (voir resolveLang). */
    resolveLang: resolveLang,
    /** Change la langue de tous les lecteurs ; mémorisée dans le navigateur sauf {remember:false}. */
    setLanguage: function (code, opts) {
      code = supportedLang(code);
      if (!code) return false;
      if (!opts || opts.remember !== false) storeLang(code);
      players.forEach(function (p) { p.setLanguage(code); });
      return true;
    },
    /** Oublie le choix mémorisé : les lecteurs suivants reprennent la langue détectée. */
    forgetLanguage: function () {
      try {
        global.localStorage.removeItem(LANG_KEY);
        global.localStorage.removeItem(OLD_LANG_KEY);
      } catch (e) { /* stockage indisponible */ }
    },
    h: h,
    Player: Player
  };
  global.AbcjsFx = AbcjsFx;
  global.AbcPlayer9 = AbcjsFx; // ancien nom, conservé pour les pages existantes

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})(window);
