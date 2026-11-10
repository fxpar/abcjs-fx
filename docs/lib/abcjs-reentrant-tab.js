/*!
 * abcjs-reentrant-tab.js — reentrant tunings for abcjs tablatures
 * (high-G ukulele, 5-string banjo, baritone/12-string tricks…)
 * Version 1.1.0 — https://github.com/fxpar/abcjs-fx — MIT
 *
 * Works with plain abcjs (>= 6.2), with or without abcjs-fx. Load it after abcjs:
 *   <script src="abcjs-basic-min.js"></script>
 *   <script src="abcjs-reentrant-tab.js"></script>
 *   ABCJS.renderAbc("paper", abc, { tablature: [{ instrument: "violin", tuning: ["G", "C", "E", "A"] }] });
 *
 * abcjs refuses tunings whose strings are not in ascending order ("C string lower than G string").
 * This patch does not modify abcjs: it wraps two methods of its string-tablature plugin at runtime.
 *   1. init: a reentrant tuning is "unfolded" (the out-of-order strings are lowered by octaves) so that
 *      abcjs accepts it, then the real string pitches are restored.
 *   2. notesToNumber: abcjs computes the notes as usual, then every note is re-assigned to a string of
 *      the real tuning: lowest fret first (closest string to the previous note on ties); in chords, one
 *      note per string, minimizing the highest fret, then the sum of frets, then the stretch
 *      (same ranking as abcjs; on unisons, earlier notes go to lower strings).
 *   5-string banjo (g D G B d, instrument "fiveString"): the drone string starts at fret 5, so it
 *   is played open or from fret 6; option "stringStartFret": [5, 0, 0, 0, 0] sets it explicitly.
 * The string-assignment algorithm comes from a proposed change to abcjs by fxpar
 * (branch feature/tablatures-reentrant-tuning).
 *
 * API: window.AbcjsReentrantTab.install(ABCJS?) -> true when the patch is active.
 */
(function (global) {
  "use strict";

  var api = {
    version: "1.1.0",
    installed: false,
    install: install,
    isReentrant: isReentrant,
    unfold: unfold
  };

  // ---------------------------------------------------------------- pitches (same scale as abcjs: "C" = 48)
  var ACCIDENTALS = { "__": -2, "_": -1, "_/": -0.5, "=": 0, "": 0, "^/": 0.5, "^": 1, "^^": 2 };
  var ORDER = ["C", "-", "D", "-", "E", "F", "-", "G", "-", "A", "-", "B",
    "c", "-", "d", "-", "e", "f", "-", "g", "-", "a", "-", "b"];

  function noteToMidi(note) {
    var m = /([_^\/=]*)([A-Ga-g])(,*)('*)/.exec(String(note));
    if (!m) return 0;
    return 48 + ORDER.indexOf(m[2]) + (ACCIDENTALS[m[1]] || 0) + (m[4].length - m[3].length) * 12;
  }

  function midiToNote(midi) {
    midi = Math.round(midi);
    var octave = Math.floor(midi / 12), pc = ((midi % 12) + 12) % 12;
    var name = ORDER[pc] === "-" ? "^" + ORDER[pc - 1] : ORDER[pc];
    if (octave > 4) {
      name = name.toLowerCase();
      for (var o = octave - 5; o > 0; o--) name += "'";
    } else {
      for (var p = octave; p < 4; p++) name += ",";
    }
    return name;
  }

  /** true when the strings are not in strictly ascending order. */
  function isReentrant(tuning) {
    for (var i = 1; i < tuning.length; i++) {
      if (noteToMidi(tuning[i]) <= noteToMidi(tuning[i - 1])) return true;
    }
    return false;
  }

  /** Ascending tuning accepted by abcjs: out-of-order strings lowered by octaves. */
  function unfold(tuning) {
    var p = tuning.map(noteToMidi);
    for (var i = p.length - 2; i >= 0; i--) {
      while (p[i] >= p[i + 1]) p[i] -= 12;
    }
    return p.map(midiToNote);
  }

  // ---------------------------------------------------------------- string assignment
  function notePitch(note) {
    var pitch = note.pitch + (note.pitchAltered || 0);
    if (note.quarter === "^") pitch -= 0.5;
    else if (note.quarter === "v") pitch += 0.5;
    return pitch;
  }

  /**
   * Every string the note can be played on (fret >= 0), lowest fret first; at the same fret,
   * full-length strings before a short string. A short string (5-string banjo drone) starts
   * further up the neck: open = 0, then startFret + 1, startFret + 2...
   */
  function candidates(sem, note) {
    var pitch = notePitch(note), list = [];
    for (var i = 0; i < sem.stringPitches.length; i++) {
      var fret = pitch - sem.stringPitches[i];
      if (fret < 0) continue;
      var start = (sem.__startFrets && sem.__startFrets[i]) || 0;
      if (start > 0 && fret > 0) fret += start;
      list.push({ arrIndex: i, num: Math.round(fret), short: start > 0 });
    }
    list.sort(function (a, b) { return a.num - b.num || a.short - b.short; });
    return list;
  }

  /**
   * Fret where each string starts: "stringStartFret" tablature option (one value per tuning entry),
   * or, for instrument "fiveString", 5 for a first string higher than the second (g D G B d).
   */
  function startFrets(params, pitches) {
    var starts = pitches.map(function (p, i) {
      var v = params && params.stringStartFret ? parseInt(params.stringStartFret[i], 10) : 0;
      return v > 0 ? v : 0;
    });
    if (params && !params.stringStartFret && params.instrument === "fiveString" &&
      pitches.length === 5 && pitches[0] > pitches[1]) starts[0] = 5;
    return starts;
  }

  function place(sem, item, chosen) {
    var n = sem.stringPitches.length;
    if (chosen) {
      item.num = chosen.num;
      item.str = n - 1 - chosen.arrIndex; // abcjs draws string 0 at the bottom
    } else {
      item.num = "?";
      item.str = n - 1;
    }
  }

  function assignSingle(sem, item) {
    if (!item || !item.note) return;
    var list = candidates(sem, item.note);
    if (sem.lastArrIndex != null) {
      list.sort(function (a, b) {
        if (a.num !== b.num) return a.num - b.num;
        if (a.short !== b.short) return a.short - b.short;
        return Math.abs(a.arrIndex - sem.lastArrIndex) - Math.abs(b.arrIndex - sem.lastArrIndex);
      });
    }
    var chosen = list[0] || null;
    if (chosen) sem.lastArrIndex = chosen.arrIndex;
    place(sem, item, chosen);
  }

  /**
   * One note per string. Prefers placing every note; then the lowest highest fret, the smallest
   * sum of frets and the smallest stretch. Backtracking is cheap: chords rarely exceed 6 notes.
   */
  function bestAssignment(lists) {
    var n = lists.length, used = {}, current = new Array(n), best = null, bestCost = null;
    function cost(a) {
      var max = -Infinity, min = Infinity, sum = 0, count = 0;
      for (var i = 0; i < a.length; i++) {
        if (!a[i]) continue;
        count++;
        max = Math.max(max, a[i].num); min = Math.min(min, a[i].num); sum += a[i].num;
      }
      return { count: count, max: max, spread: max - min, sum: sum };
    }
    // Same ranking as the original abcjs algorithm: each note on its lowest-fret string
    // (highest fret, then sum of frets, then spread); on a perfect tie (unisons),
    // earlier notes go to lower strings.
    function better(a, aCost, b, bCost) {
      if (aCost.count !== bCost.count) return aCost.count > bCost.count;
      if (aCost.max !== bCost.max) return aCost.max < bCost.max;
      if (aCost.sum !== bCost.sum) return aCost.sum < bCost.sum;
      if (aCost.spread !== bCost.spread) return aCost.spread < bCost.spread;
      for (var i = 0; i < a.length; i++) {
        var ai = a[i] ? a[i].arrIndex : Infinity, bi = b[i] ? b[i].arrIndex : Infinity;
        if (ai !== bi) return ai < bi;
      }
      return false;
    }
    (function walk(k) {
      if (k === n) {
        var c = cost(current);
        if (!best || better(current, c, best, bestCost)) { best = current.slice(); bestCost = c; }
        return;
      }
      for (var i = 0; i < lists[k].length; i++) {
        var cand = lists[k][i];
        if (used[cand.arrIndex]) continue;
        used[cand.arrIndex] = true;
        current[k] = cand;
        walk(k + 1);
        used[cand.arrIndex] = false;
      }
      current[k] = null; // a note may stay unplaced if nothing else fits
      walk(k + 1);
    })(0);
    return best || [];
  }

  function assignChord(sem, items) {
    // also with more notes than strings: as many notes as possible, "?" for the others
    var real = items.filter(function (it) { return it && it.note; });
    var chosen = bestAssignment(real.map(function (it) { return candidates(sem, it.note); }));
    real.forEach(function (it, i) { place(sem, it, chosen[i]); });
  }

  // ---------------------------------------------------------------- runtime patch
  function patchSemantics(proto) {
    if (proto.__reentrantPatched) return;
    proto.__reentrantPatched = true;
    var original = proto.notesToNumber;
    proto.notesToNumber = function (notes, graces) {
      var res = original.call(this, notes, graces);
      if (!this.__reentrant || !res || !res.notes) return res;
      if (res.notes.length > 1) assignChord(this, res.notes);
      else if (res.notes.length === 1) assignSingle(this, res.notes[0]);
      if (res.graces) for (var i = 0; i < res.graces.length; i++) assignSingle(this, res.graces[i]);
      return res;
    };
  }

  function patchPlugin(Plugin) {
    if (!Plugin || !Plugin.prototype || Plugin.prototype.__reentrantPatched) return !!Plugin;
    var originalInit = Plugin.prototype.init;
    Plugin.prototype.init = function (abcTune, tuneNumber, params, tabSettings) {
      var tuning = (params && params.tuning) || (tabSettings && tabSettings.defaultTuning);
      if (!tuning || !isReentrant(tuning)) return originalInit.apply(this, arguments);

      originalInit.call(this, abcTune, tuneNumber, Object.assign({}, params, { tuning: unfold(tuning) }), tabSettings);
      this.params = params;
      this.tuning = tuning;
      var sem = this.semantics;
      if (!sem || this.inError) return;
      sem.tuning = tuning; // label "%T" shows the real tuning
      sem.stringPitches = tuning.map(function (t) { return noteToMidi(t) + (sem.capo || 0); });
      sem.lastArrIndex = null;
      sem.__startFrets = startFrets(params, sem.stringPitches);
      sem.__reentrant = true;
      patchSemantics(Object.getPrototypeOf(sem));
    };
    Plugin.prototype.__reentrantPatched = true;
    return true;
  }

  /**
   * abcjs does not export its tablature plugin, but every rendered tune keeps a reference to its
   * constructor (tune.tablatures[i].classz). A headless render ("*") is enough to reach it.
   */
  function install(ABCJS) {
    if (api.installed) return true;
    ABCJS = ABCJS || global.ABCJS;
    if (!ABCJS || typeof ABCJS.renderAbc !== "function") return false;
    try {
      var tunes = ABCJS.renderAbc("*", "X:1\nK:C\nC|]\n", { tablature: [{ instrument: "violin" }] });
      var tab = tunes && tunes[0] && tunes[0].tablatures && tunes[0].tablatures[0];
      api.installed = patchPlugin(tab && tab.classz);
    } catch (e) {
      api.installed = false;
    }
    if (!api.installed && global.console) {
      console.warn("[abcjs-reentrant-tab] could not patch this version of abcjs; reentrant tunings stay unsupported");
    }
    return api.installed;
  }

  global.AbcjsReentrantTab = api;
  if (global.ABCJS) install(global.ABCJS);
})(typeof window !== "undefined" ? window : this);
