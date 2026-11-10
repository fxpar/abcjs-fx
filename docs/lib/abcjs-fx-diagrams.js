/*!
 * abcjs-fx-diagrams.js — extension "diagrammes d'accords" pour abcjs-fx.js
 * Version 9.2.0 — https://github.com/fxpar/abcjs-fx — MIT
 *
 * Chargement (dans cet ordre) :
 *   abcjs-basic.js, abcjs-fx.js, chord-library.js (optionnel mais conseillé), abcjs-fx-diagrams.js
 *
 * Activation sur un lecteur :
 *   <textarea data-abcjs-fx chord-diagrams="ukulele"> ... </textarea>
 *   valeurs : ukulele | guitar | baritone | mandolin | liste de cordes ex. "G,C,E,A"
 *   diagram-size="44"  hauteur des diagrammes (taille de la police d'accords réservée)
 *
 * Principe (suggestion de Paul Rosen) : on agrandit la police des accords (gchordfont)
 * pour qu'abcjs réserve la place au-dessus de la portée, puis on remplace chaque nom
 * d'accord par un diagramme SVG dessiné au même endroit. Les noms lus sont ceux affichés
 * par abcjs : ils suivent donc la transposition.
 * Changer de forme, dans la partition (discret : rien n'apparaît hors survol) :
 *   survol (ou 1er appui tactile) -> languettes ‹ › : changent CETTE occurrence seulement ;
 *   double-clic / Entrée : appliquer la forme à toutes les occurrences de l'accord ;
 *   clavier : Tab jusqu'au diagramme, ← → pour changer, Échap pour quitter.
 * Panneau ⋮ : forme par défaut de chaque accord. Les choix survivent à la transposition.
 * Les accords absents de chord-library.js sont calculés (dim, aug, m(maj7), 7#5...).
 */
(function (global) {
  "use strict";

  if (!global.AbcjsFx && !global.AbcPlayer9) {
    console.error("[abcjs-fx-diagrams] abcjs-fx.js doit être chargé avant abcjs-fx-diagrams.js");
    return;
  }
  var AbcjsFx = global.AbcjsFx || global.AbcPlayer9;
  var SVG_NS = "http://www.w3.org/2000/svg";

  // ---------------------------------------------------------------- instruments
  // Cordes de gauche à droite sur le diagramme (= ordre de chord-library.js)
  var INSTRUMENTS = {
    ukulele: { tuning: ["G", "C", "E", "A"], library: "ukulele", bassRoot: false },
    guitar: { tuning: ["E", "A", "D", "G", "B", "E"], library: "guitar", bassRoot: true, mutes: 2 },
    baritone: { tuning: ["D", "G", "B", "E"], library: null, bassRoot: true },
    mandolin: { tuning: ["G", "D", "A", "E"], library: null, bassRoot: false }
  };

  var I18N = {
    fr: { colon: " :", shapes: "Formes par défaut", generated: "forme calculée", none: "aucune forme trouvée",
      help: "‹ › : changer cette occurrence — double-clic / Entrée : appliquer à tous",
      panelHelp: "Dans la partition : survolez un diagramme, ‹ › change cet accord seulement, double-clic l'applique à tous.",
      customCount: "occurrences personnalisées" },
    en: { colon: ":", shapes: "Default shapes", generated: "computed shape", none: "no shape found",
      help: "‹ ›: change this occurrence — double-click / Enter: apply to all",
      panelHelp: "In the score: hover a diagram, ‹ › changes this chord only, double-click applies it to all.",
      customCount: "customized occurrences" }
  };

  // ---------------------------------------------------------------- théorie
  var PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  var FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  var SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Suffixe normalisé -> intervalles (demi-tons depuis la fondamentale)
  var QUALITIES = {
    "": [0, 4, 7], "m": [0, 3, 7], "dim": [0, 3, 6], "aug": [0, 4, 8], "5": [0, 7],
    "6": [0, 4, 7, 9], "m6": [0, 3, 7, 9], "7": [0, 4, 7, 10], "maj7": [0, 4, 7, 11],
    "m7": [0, 3, 7, 10], "m7b5": [0, 3, 6, 10], "dim7": [0, 3, 6, 9], "mmaj7": [0, 3, 7, 11],
    "maj7#5": [0, 4, 8, 11], "7#5": [0, 4, 8, 10], "7b5": [0, 4, 6, 10], "sus2": [0, 2, 7], "sus4": [0, 5, 7],
    "7sus4": [0, 5, 7, 10], "add9": [0, 4, 7, 2], "madd9": [0, 3, 7, 2], "9": [0, 4, 7, 10, 2],
    "maj9": [0, 4, 7, 11, 2], "m9": [0, 3, 7, 10, 2], "7b9": [0, 4, 7, 10, 1], "11": [0, 4, 7, 10, 2, 5],
    "13": [0, 4, 7, 10, 2, 9]
  };
  // Écritures équivalentes -> suffixe normalisé
  var ALIASES = {
    "maj": "", "M": "", "min": "m", "mi": "m", "-": "m", "o": "dim", "°": "dim", "+": "aug", "#5": "aug",
    "M7": "maj7", "Δ": "maj7", "Δ7": "maj7", "ma7": "maj7", "j7": "maj7", "min7": "m7", "-7": "m7", "mi7": "m7",
    "ø": "m7b5", "ø7": "m7b5", "m7-5": "m7b5", "o7": "dim7", "°7": "dim7", "mM7": "mmaj7", "m(maj7)": "mmaj7",
    "minmaj7": "mmaj7", "-maj7": "mmaj7", "+maj7": "maj7#5", "maj7+5": "maj7#5", "maj7(#5)": "maj7#5",
    "aug7": "7#5", "+7": "7#5", "7+5": "7#5", "7(#5)": "7#5", "7(b5)": "7b5", "sus": "sus4", "7sus": "7sus4",
    "min6": "m6", "-6": "m6", "M9": "maj9", "min9": "m9", "-9": "m9", "2": "sus2", "add2": "add9", "6/9": "6"
  };

  function pcOf(note) {
    var m = /^([A-G])([#b♯♭]?)/.exec(note);
    if (!m) return null;
    return (PC[m[1]] + (m[2] === "#" || m[2] === "♯" ? 1 : m[2] === "b" || m[2] === "♭" ? -1 : 0) + 12) % 12;
  }

  /** "F♯m7/C♯" -> {root:"F#", rootPc:6, suffix:"m7", bass:"C#", bassPc:1, intervals:[...] } ; null si ce n'est pas un accord */
  function parseChord(raw) {
    var name = String(raw || "").trim().replace(/♯/g, "#").replace(/♭/g, "b");
    var m = /^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/.exec(name);
    if (!m) return null;
    var suffix = m[2].trim();
    var norm = ALIASES.hasOwnProperty(suffix) ? ALIASES[suffix] : suffix;
    if (!QUALITIES.hasOwnProperty(norm)) {
      var noParen = norm.replace(/[()]/g, "");
      norm = ALIASES.hasOwnProperty(noParen) ? ALIASES[noParen] : noParen;
    }
    if (!QUALITIES.hasOwnProperty(norm)) return null;
    var rootPc = pcOf(m[1]);
    return {
      name: name, root: m[1], rootPc: rootPc, suffix: norm, intervals: QUALITIES[norm],
      bass: m[3] || null, bassPc: m[3] ? pcOf(m[3]) : rootPc,
      pcs: QUALITIES[norm].map(function (i) { return (rootPc + i) % 12; })
    };
  }

  // ---------------------------------------------------------------- formes
  function library() {
    try { if (typeof chordLibrary !== "undefined") return chordLibrary; } catch (e) { /* non chargée */ }
    return global.chordLibrary || null;
  }

  function splitFrets(s) { return String(s || "").indexOf(",") >= 0 ? s.split(",") : String(s || "").split(""); }

  /** Forme -> frettes absolues (null = corde étouffée). chord-library : absolu = position + relatif. */
  function absoluteFrets(shape) {
    var pos = parseInt(shape.position, 10) || 0;
    return splitFrets(shape.frets).map(function (f) {
      if (/^x$/i.test(f)) return null;
      var n = parseInt(f, 10);
      return n === 0 ? 0 : n + pos;
    });
  }

  function shapeKey(abs) { return abs.map(function (f) { return f === null ? "x" : f; }).join(","); }

  /**
   * Orthographes à tester dans la bibliothèque (C# / Db...). Pas de repli approximatif
   * (ex. dim -> dim7, qui ajoute une note) : les accords absents sont calculés.
   */
  function libraryKeys(chord) {
    var keys = [];
    [chord.root, FLAT_NAMES[chord.rootPc], SHARP_NAMES[chord.rootPc]].forEach(function (r) {
      if (keys.indexOf(r + chord.suffix) < 0) keys.push(r + chord.suffix);
    });
    return keys;
  }

  function libraryShapes(instr, chord) {
    var lib = library();
    var table = lib && instr.library && lib[instr.library];
    if (!table || chord.bass !== chord.root && chord.bass !== null && instr.bassRoot) return [];
    var keys = libraryKeys(chord);
    for (var k = 0; k < keys.length; k++) {
      var list = [];
      if (table[keys[k]]) list.push(table[keys[k]]);
      for (var v = 2; table[keys[k] + "_v" + v]; v++) list.push(table[keys[k] + "_v" + v]);
      if (list.length) {
        return list.filter(function (s) { return splitFrets(s.frets).length === instr.pcs.length; })
          .map(function (s) {
            return { abs: absoluteFrets(s), fingers: splitFrets(s.fingers), barre: s.barre,
              libPosition: parseInt(s.position, 10) || 0, source: "library" };
          });
      }
    }
    return [];
  }

  /**
   * Calcule des doigtés : toutes les notes de l'accord présentes (la quinte peut sauter
   * s'il y a plus de notes que de cordes), écart de 4 cases max, 4 doigts max (barré compris),
   * basse = fondamentale (ou note après "/") pour les instruments non rentrants.
   */
  function generateShapes(instr, chord, max) {
    var n = instr.pcs.length, results = [], seen = {};
    for (var base = 1; base <= 10; base++) {
      var options = instr.pcs.map(function (open, s) {
        var opts = [];
        if (instr.mutes && s < instr.mutes) opts.push(null);
        if (chord.pcs.indexOf(open) >= 0) opts.push(0);
        for (var f = base; f < base + 4; f++) if (chord.pcs.indexOf((open + f) % 12) >= 0) opts.push(f);
        return opts;
      });
      var current = [];
      (function walk(s) {
        if (s === n) { evaluate(current.slice()); return; }
        for (var i = 0; i < options[s].length; i++) {
          var f = options[s][i];
          // étouffées seulement du côté grave et d'affilée
          if (f === null && s > 0 && current[s - 1] !== null) continue;
          current[s] = f;
          walk(s + 1);
        }
      })(0);
    }

    function evaluate(abs) {
      var sounding = [], fretted = [];
      abs.forEach(function (f, s) {
        if (f === null) return;
        sounding.push((instr.pcs[s] + f) % 12);
        if (f > 0) fretted.push(f);
      });
      if (sounding.length < Math.min(n, 4)) return;
      var required = chord.pcs.slice();
      if (required.length > sounding.length) {
        required = required.filter(function (pc) { return (pc - chord.rootPc + 12) % 12 !== 7; });
      }
      for (var r = 0; r < required.length; r++) if (sounding.indexOf(required[r]) < 0) return;
      if (instr.bassRoot && sounding[0] !== chord.bassPc) return;
      var minF = fretted.length ? Math.min.apply(null, fretted) : 0;
      var maxF = fretted.length ? Math.max.apply(null, fretted) : 0;
      if (maxF - minF > 3) return;
      var atMin = fretted.filter(function (f) { return f === minF; }).length;
      var fingers = fretted.length - (atMin > 1 ? atMin - 1 : 0);
      if (fingers > 4) return;
      var key = shapeKey(abs);
      if (seen[key]) return;
      seen[key] = true;
      var opens = abs.filter(function (f) { return f === 0; }).length;
      var mutes = abs.filter(function (f) { return f === null; }).length;
      var score = minF * 1.2 + (maxF - minF) + fingers * 0.6 - opens * 0.4 + mutes * 0.8
        + (sounding[0] === chord.rootPc ? 0 : 0.5);
      var barre = atMin > 1 && fretted.length > 4 ? minF : null;
      results.push({ abs: abs, score: score, barreAbs: barre, source: "generated" });
    }

    results.sort(function (a, b) { return a.score - b.score; });
    return results.slice(0, max || 6);
  }

  var shapeCache = {};
  function shapesFor(instr, chordName) {
    var key = instr.id + "|" + chordName;
    if (shapeCache[key]) return shapeCache[key];
    var chord = parseChord(chordName);
    var list = [];
    if (chord) {
      list = libraryShapes(instr, chord);
      var known = {};
      list.forEach(function (s) { known[shapeKey(s.abs)] = true; });
      generateShapes(instr, chord, 6).forEach(function (g) {
        if (!known[shapeKey(g.abs)] && list.length < 8) { known[shapeKey(g.abs)] = true; list.push(g); }
      });
    }
    shapeCache[key] = list;
    return list;
  }

  // ---------------------------------------------------------------- dessin SVG
  function el(tag, attrs, parent) {
    var e = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /**
   * Dessine un diagramme (unités internes) et renvoie {g, width, height}.
   * Origine en haut à gauche.
   */
  function drawDiagram(name, shape, index, total, custom) {
    var S = 10, F = 12, LEFT = 13, NAME_H = 14, MARK_H = 9, TAB = 9;
    var g = el("g", { "class": "abcp-dg" + (custom ? " abcp-dg-custom" : ""), tabindex: "0", role: "button" });
    var nStrings = shape ? shape.abs.length : 4;
    var W = (nStrings - 1) * S;
    var width = LEFT + W + 4 + TAB; // marge droite = place de la languette ›

    el("rect", { "class": "abcp-dg-bg", x: 0, y: 0, width: width, height: 10, rx: 3, fill: "#fff", stroke: "none" }, g);
    var title = el("text", { "class": "abcp-dg-name", x: LEFT + W / 2, y: 11, "text-anchor": "middle",
      "font-size": 12, "font-family": "Arial, sans-serif", "font-weight": "bold", fill: "#000" }, g);
    title.textContent = name;

    if (!shape) {
      var q = el("text", { x: LEFT + W / 2, y: NAME_H + 20, "text-anchor": "middle", "font-size": 14, fill: "#999",
        "font-family": "Arial, sans-serif" }, g);
      q.textContent = "?";
      g.firstChild.setAttribute("height", NAME_H + 30);
      return { g: g, width: width, height: NAME_H + 30 };
    }

    var fretted = shape.abs.filter(function (f) { return f !== null && f > 0; });
    var maxF = fretted.length ? Math.max.apply(null, fretted) : 0;
    var minF = fretted.length ? Math.min.apply(null, fretted) : 0;
    // Position : première case affichée
    var first = maxF <= 4 ? 1 : minF;
    var rows = Math.max(4, maxF - first + 1);
    var top = NAME_H + MARK_H;
    var gridH = rows * F;

    var grid = el("g", { transform: "translate(" + LEFT + "," + top + ")" }, g);
    for (var r = 0; r <= rows; r++) {
      el("line", { x1: 0, x2: W, y1: r * F, y2: r * F, stroke: "#222", "stroke-width": r === 0 && first === 1 ? 3 : 0.8 }, grid);
    }
    for (var s = 0; s < nStrings; s++) {
      el("line", { x1: s * S, x2: s * S, y1: 0, y2: gridH, stroke: "#222", "stroke-width": 0.8 }, grid);
    }
    if (first > 1) {
      var pos = el("text", { x: -3, y: F * 0.5 + 3.5, "text-anchor": "end", "font-size": 8,
        "font-family": "Arial, sans-serif", fill: "#000" }, grid);
      pos.textContent = first + "fr";
    }

    // Barré : bibliothèque (case relative) ou forme calculée (case absolue)
    var barres = [];
    if (shape.source === "library" && shape.barre) {
      String(shape.barre).split(",").forEach(function (b) {
        var rel = parseInt(b, 10);
        if (rel > 0) barres.push(rel + (shape.libPosition || 0));
      });
    } else if (shape.barreAbs) barres.push(shape.barreAbs);
    barres.forEach(function (abs) {
      var idx = [];
      shape.abs.forEach(function (f, i) { if (f === abs) idx.push(i); });
      if (idx.length < 2) return;
      var y = (abs - first + 0.5) * F;
      el("rect", { x: idx[0] * S - 3.6, y: y - 3.6, width: (idx[idx.length - 1] - idx[0]) * S + 7.2, height: 7.2,
        rx: 3.6, fill: "#222" }, grid);
    });

    shape.abs.forEach(function (f, i) {
      var x = i * S;
      if (f === null) {
        el("path", { d: "M" + (x - 2.5) + "," + (-7.5) + "l5,5m0,-5l-5,5", stroke: "#222", "stroke-width": 1.1, fill: "none" }, grid);
      } else if (f === 0) {
        el("circle", { cx: x, cy: -5, r: 2.6, fill: "#fff", stroke: "#222", "stroke-width": 0.9 }, grid);
      } else {
        var cy = (f - first + 0.5) * F;
        el("circle", { "class": "abcp-dg-dot", cx: x, cy: cy, r: 3.8, fill: "#222" }, grid);
        var finger = shape.fingers && shape.fingers[i];
        if (finger && finger !== "0") {
          var t = el("text", { x: x, y: cy + 2.4, "text-anchor": "middle", "font-size": 6.5, fill: "#fff",
            "font-family": "Arial, sans-serif", "font-weight": "bold" }, grid);
          t.textContent = finger;
        }
      }
    });

    var height = top + gridH + 4;
    if (total > 1) {
      // Numéro de forme : visible au survol, ou en permanence si l'occurrence est personnalisée
      var idxText = el("text", { "class": "abcp-dg-idx", x: LEFT + W / 2, y: height + 6, "text-anchor": "middle",
        "font-size": 7, fill: shape.source === "generated" ? "#a15c00" : "#777", "font-family": "Arial, sans-serif" }, g);
      idxText.textContent = (index + 1) + "/" + total + (shape.source === "generated" ? "*" : "");
      height += 9;

      // Languettes ‹ › (masquées tant qu'on ne survole / sélectionne pas le diagramme)
      [-1, 1].forEach(function (dir) {
        var x = dir < 0 ? 0 : width - TAB;
        var nav = el("g", { "class": "abcp-dg-nav", "data-dir": dir }, g);
        el("rect", { x: x, y: top - 3, width: TAB, height: gridH + 6, rx: 2, fill: "#0073aa", "fill-opacity": 0.15 }, nav);
        var arrow = el("text", { x: x + TAB / 2, y: top + gridH / 2 + 4, "text-anchor": "middle", "font-size": 12,
          "font-weight": "bold", fill: "#0073aa", "font-family": "Arial, sans-serif" }, nav);
        arrow.textContent = dir < 0 ? "‹" : "›";
      });
    }
    g.firstChild.setAttribute("height", height);
    return { g: g, width: width, height: height };
  }

  // ---------------------------------------------------------------- intégration au lecteur
  function instrumentFor(spec) {
    spec = String(spec || "").trim();
    var key = spec.toLowerCase();
    var def = INSTRUMENTS[key];
    if (!def) {
      var strings = spec.split(/[\s,]+/).filter(Boolean);
      if (strings.length < 3 || strings.some(function (s) { return pcOf(s) === null; })) def = INSTRUMENTS.ukulele, key = "ukulele";
      else def = { tuning: strings, library: null, bassRoot: true }, key = strings.join(",");
    }
    return {
      id: key, library: def.library, bassRoot: def.bassRoot, mutes: def.mutes || 0,
      pcs: def.tuning.map(pcOf)
    };
  }

  var CSS = [
    ".abcp-dg{cursor:pointer;outline:none}",
    ".abcp-dg:hover .abcp-dg-bg,.abcp-dg-active .abcp-dg-bg{fill:#eef6fb}",
    ".abcp-dg:focus-visible .abcp-dg-bg{stroke:#0073aa;stroke-width:.8}",
    // Discret : languettes et numéro de forme n'apparaissent qu'au survol / à la sélection
    ".abcp-dg-nav,.abcp-dg-idx{opacity:0;transition:opacity .15s}",
    ".abcp-dg:hover .abcp-dg-nav,.abcp-dg:hover .abcp-dg-idx,.abcp-dg-active .abcp-dg-nav,.abcp-dg-active .abcp-dg-idx," +
      ".abcp-dg:focus-visible .abcp-dg-nav,.abcp-dg:focus-visible .abcp-dg-idx{opacity:1}",
    ".abcp-dg-nav:hover rect{fill-opacity:.35}",
    // Occurrence personnalisée : seul son numéro reste visible, en bleu
    ".abcp-dg-custom .abcp-dg-idx{opacity:1;fill:#0073aa;font-weight:bold}",
    ".abcp .highlight .abcp-dg-dot{fill:#0a9ecc}",
    ".abcp .highlight .abcp-dg-name{fill:#0a9ecc}",
    ".abcp-shapes{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;align-items:center}",
    ".abcp-shapes>b{margin-right:4px}",
    ".abcp-shape{display:inline-flex;align-items:center;border:1px solid #dee2e6;border-radius:12px;background:#f8f9fa;font-size:13px}",
    ".abcp-shape button{border:none;background:none;cursor:pointer;padding:2px 6px;color:#0073aa}",
    ".abcp-shape button:disabled{visibility:hidden}",
    ".abcp-shape span{padding:0 2px;white-space:nowrap}",
    ".abcp-shape small{color:#888;margin-left:4px}",
    ".abcp-shape em{color:#0073aa;font-style:normal;margin-left:3px}",
    ".abcp-shapes-help{flex-basis:100%;color:#666;font-size:12px}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("abcjs-fx-diagrams-style")) return;
    var st = document.createElement("style");
    st.id = "abcjs-fx-diagrams-style";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function chordKey(text) { return text.replace(/♯/g, "#").replace(/♭/g, "b").trim(); }

  /**
   * Clé d'un accord indépendante de la transposition (ramenée au ton d'origine) :
   * les formes choisies restent associées au bon accord quand on transpose.
   */
  function degreeKey(chord, semis) {
    var t = ((semis % 12) + 12) % 12;
    return ((chord.rootPc - t + 12) % 12) + "|" + chord.suffix + "|" + ((chord.bassPc - t + 12) % 12);
  }

  /**
   * Remplace les noms d'accords rendus par abcjs par des diagrammes.
   * Forme affichée : d.occ[occurrence] (cet accord-là) sinon d.def[clé] (toutes ses occurrences).
   */
  function decorate(player) {
    var d = player.diagrams;
    d.t = I18N[player.lang] || I18N.en; // suit le changement de langue du lecteur
    var semis = player.state ? player.state.transpose : 0;
    var svgs = player.paperEl.querySelectorAll("svg");
    var used = [], seenKey = {}, ordinal = 0, toFocus = null;
    d.occKeys = {};
    bindPaperOnce(player);
    Array.prototype.forEach.call(svgs, function (svg, svgIndex) {
      Array.prototype.forEach.call(svg.querySelectorAll(".abcp-dg"), function (n) { n.remove(); });
      Array.prototype.forEach.call(svg.querySelectorAll("text.abcjs-chord"), function (text) {
        var name = chordKey(text.textContent);
        var chord = parseChord(name);
        if (!chord) {
          // Texte entre guillemets qui n'est pas un accord : taille normale
          text.setAttribute("font-size", 14);
          text.removeAttribute("visibility");
          return;
        }
        var shapes = shapesFor(d.instr, name);
        var key = degreeKey(chord, semis);
        // Identifiant d'occurrence : morceau + partition + rang de l'accord
        var occ = (player.current || 0) + ":" + svgIndex + ":" + (ordinal++);
        d.occKeys[occ] = key;
        if (!seenKey[key]) { seenKey[key] = true; used.push({ name: name, key: key }); }

        var count = Math.max(shapes.length, 1);
        var custom = d.occ.hasOwnProperty(occ);
        var idx = (custom ? d.occ[occ] : (d.def[key] || 0)) % count;
        // Revenu à la forme par défaut : plus personnalisé
        if (custom && idx === (d.def[key] || 0) % count) { delete d.occ[occ]; custom = false; }

        var box;
        try { box = text.getBBox(); } catch (e) { return; }
        var dg = drawDiagram(name, shapes[idx] || null, idx, shapes.length, custom);
        var scale = (box.height * d.fill) / dg.height;
        var x = box.x + box.width / 2 - (dg.width * scale) / 2;
        var y = box.y + box.height - dg.height * scale;
        dg.g.setAttribute("transform", "translate(" + x.toFixed(2) + "," + y.toFixed(2) + ") scale(" + scale.toFixed(4) + ")");
        var tip = el("title", {}, null);
        tip.textContent = name + (shapes[idx] && shapes[idx].source === "generated" ? " — " + d.t.generated : "") +
          "\n" + (shapes.length > 1 ? d.t.help : shapes.length ? "" : d.t.none);
        dg.g.insertBefore(tip, dg.g.firstChild);
        dg.g.setAttribute("aria-label", name);
        if (d.active === occ) dg.g.classList.add("abcp-dg-active");
        text.setAttribute("visibility", "hidden");
        // Dans le groupe de la note : le diagramme se colore avec le curseur de lecture
        text.parentNode.insertBefore(dg.g, text.nextSibling);
        bindDiagram(player, dg.g, { occ: occ, key: key, idx: idx, count: shapes.length });
        if (d.focus === occ) toFocus = dg.g;
      });
    });
    d.used = used;
    renderShapePanel(player);
    if (toFocus) { try { toFocus.focus({ preventScroll: true }); } catch (e) { toFocus.focus(); } }
  }

  /** Change la forme de CETTE occurrence uniquement. */
  function stepOccurrence(player, info, delta) {
    if (info.count < 2) return;
    var d = player.diagrams;
    d.occ[info.occ] = ((info.idx + delta) % info.count + info.count) % info.count;
    d.active = info.occ;
    decorate(player);
  }

  /** Applique la forme de cette occurrence à toutes celles du même accord. */
  function applyToAll(player, info) {
    var d = player.diagrams;
    d.def[info.key] = info.idx;
    Object.keys(d.occ).forEach(function (o) { if (d.occKeys[o] === info.key) delete d.occ[o]; });
    decorate(player);
  }

  /** Forme par défaut d'un accord (panneau). Les occurrences personnalisées sont conservées. */
  function stepDefault(player, key, delta, count) {
    if (count < 2) return;
    var d = player.diagrams;
    d.def[key] = (((d.def[key] || 0) + delta) % count + count) % count;
    decorate(player);
  }

  function setActive(player, occ) {
    player.diagrams.active = occ;
    Array.prototype.forEach.call(player.paperEl.querySelectorAll(".abcp-dg-active"), function (g) {
      g.classList.remove("abcp-dg-active");
    });
  }

  function bindDiagram(player, g, info) {
    var d = player.diagrams;
    var lastPointer = "mouse";
    // On isole le diagramme : ni sélection de note abcjs, ni lecture/pause de la partition
    ["mousedown", "mouseup", "touchstart", "touchend", "pointerup", "dblclick"].forEach(function (type) {
      g.addEventListener(type, function (e) { e.stopPropagation(); });
    });
    g.addEventListener("pointerdown", function (e) { e.stopPropagation(); lastPointer = e.pointerType || "mouse"; });
    g.addEventListener("focus", function () { d.focus = info.occ; });

    g.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      var isActive = g.classList.contains("abcp-dg-active");
      var nav = e.target.closest && e.target.closest(".abcp-dg-nav");
      // Au toucher, le 1er appui ne fait qu'afficher les languettes (invisibles jusque-là)
      if (nav && (lastPointer !== "touch" || isActive)) {
        d.focus = info.occ;
        stepOccurrence(player, info, parseInt(nav.getAttribute("data-dir"), 10));
        return;
      }
      setActive(player, isActive ? null : info.occ);
      if (!isActive) g.classList.add("abcp-dg-active");
    });
    g.addEventListener("dblclick", function (e) {
      e.preventDefault();
      if (e.target.closest && e.target.closest(".abcp-dg-nav")) return;
      applyToAll(player, info);
    });
    g.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        d.focus = info.occ;
        stepOccurrence(player, info, e.key === "ArrowLeft" ? -1 : 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        d.focus = info.occ;
        applyToAll(player, info);
      } else if (e.key === "Escape") {
        setActive(player, null);
        g.blur();
      }
    });
  }

  /** Un clic ailleurs sur la partition referme la sélection d'un diagramme. */
  function bindPaperOnce(player) {
    var d = player.diagrams;
    if (d.paperBound) return;
    d.paperBound = true;
    player.paperEl.addEventListener("pointerdown", function (e) {
      if (!(e.target.closest && e.target.closest(".abcp-dg"))) setActive(player, null);
    }, true);
  }

  function renderShapePanel(player) {
    var d = player.diagrams;
    if (!player.panelEl) return;
    if (!d.panel) {
      d.panel = AbcjsFx.h("div", { className: "abcp-shapes" });
      var actions = player.panelEl.querySelector(".abcp-actions");
      player.panelEl.insertBefore(d.panel, actions);
    }
    var panel = d.panel;
    panel.textContent = "";
    if (!d.used.length) { panel.hidden = true; return; }
    panel.hidden = false;
    panel.appendChild(AbcjsFx.h("b", { text: d.t.shapes + d.t.colon }));
    d.used.forEach(function (u) {
      var shapes = shapesFor(d.instr, u.name);
      var idx = (d.def[u.key] || 0) % Math.max(shapes.length, 1);
      var customCount = Object.keys(d.occ).filter(function (o) { return d.occKeys[o] === u.key; }).length;
      var prev = AbcjsFx.h("button", { type: "button", text: "◀", "aria-label": u.name + " -", disabled: shapes.length < 2 });
      var next = AbcjsFx.h("button", { type: "button", text: "▶", "aria-label": u.name + " +", disabled: shapes.length < 2 });
      prev.addEventListener("click", function () { stepDefault(player, u.key, -1, shapes.length); });
      next.addEventListener("click", function () { stepDefault(player, u.key, 1, shapes.length); });
      panel.appendChild(AbcjsFx.h("span", { className: "abcp-shape" }, [
        prev,
        AbcjsFx.h("span", {}, [
          u.name,
          AbcjsFx.h("small", { text: shapes.length ? (idx + 1) + "/" + shapes.length : "?" }),
          customCount ? AbcjsFx.h("em", { text: "+" + customCount, title: d.t.customCount }) : null
        ]),
        next
      ]));
    });
    panel.appendChild(AbcjsFx.h("span", { className: "abcp-shapes-help", text: d.t.panelHelp }));
  }

  AbcjsFx.plugins.push({
    name: "diagrams",
    configure: function (player, cfg) {
      var spec = cfg.attr ? cfg.attr("chord-diagrams") : cfg.chordDiagrams;
      if (!spec || spec === "false") return;
      injectCss();
      var size = parseFloat(cfg.attr && cfg.attr("diagram-size")) || 44;
      player.diagrams = {
        instr: instrumentFor(spec),
        def: {},   // forme par défaut, par accord (clé de degré)
        occ: {},   // formes personnalisées, par occurrence
        occKeys: {},
        used: [],
        fill: 1.15, // diagramme un peu plus haut que la boîte du texte réservé
        t: I18N[player.lang] || I18N.en
      };
      var o = player.options;
      o.add_classes = true; // nécessaire pour trouver text.abcjs-chord
      o.format = Object.assign({ gchordfont: "Arial " + size }, o.format || {});
    },
    afterRender: function (player) {
      if (player.diagrams) decorate(player);
    }
  });

  // Outils exposés (tests, usage avancé)
  AbcjsFx.diagrams = {
    parseChord: parseChord, shapesFor: function (instrument, name) { return shapesFor(instrumentFor(instrument), name); },
    generateShapes: function (instrument, name) { return generateShapes(instrumentFor(instrument), parseChord(name), 8); },
    instruments: INSTRUMENTS,
    i18n: I18N
  };
})(window);
