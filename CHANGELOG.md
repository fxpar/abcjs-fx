# Changelog / Historique

## 9.2.0 — 2026-11

### Added / Ajouts
- `abcjs-reentrant-tab.js` 1.1.0: **5-string banjo** — the short drone string starts at fret 5 (played
  open or from fret 6); detected for `"instrument": "fiveString"` with a tuning such as `g D G B d`,
  or set with the new `stringStartFret` option. At the same fret, full-length strings come first.
  / Banjo 5 cordes : la corde de bourdon courte commence à la 5ᵉ case.

### Changed / Modifié
- Chords with more notes than strings: as many notes as possible get a string, the others show "?"
  (they could be stacked on one string before). / Plus jamais deux notes sur la même corde.

## 9.1.1 — 2026-11

### Changed / Modifié
- `abcjs-reentrant-tab.js` 1.0.1: chords are ranked like the original abcjs algorithm — highest fret,
  then **sum of frets**, then stretch (each note stays on its lowest-fret string); on unisons, earlier
  notes go to lower strings. / Classement des accords aligné sur l'algorithme d'origine d'abcjs.

## 9.1.0 — 2026-11

### Added / Ajouts
- **`abcjs-reentrant-tab.js`**: optional runtime patch for abcjs tablatures — reentrant tunings
  (high-G ukulele, 5-string banjo…), notes placed on the lowest fret, one note per string in chords with
  the smallest stretch. Works with plain abcjs, without modifying it; disables itself if abcjs changes
  its internals. abcjs-fx installs it automatically when it is loaded. / Patch facultatif pour les
  accordages rentrants des tablatures abcjs.

## 9.0.0 — 2026-11

First release as a standalone repository. / Première version publiée comme dépôt autonome.

### Renamed / Renommé
- Files: `abcplayer9.js` → `abcjs-fx.js`, `abcplayer9d.js` → `abcjs-fx-diagrams.js`.
- `window.AbcPlayer9` → `window.AbcjsFx`, `data-abcplayer` → `data-abcjs-fx`, `.abcplayer9` → `.abcjs-fx`,
  `abcplayer9:render` → `abcjs-fx:render`. **The former names remain supported** (aliases), as do the
  `<textarea id="abc_ex_…">` of versions 6 – 8. / Les anciens noms restent acceptés.

### Added / Ajouts
- Display modes `editor`, `audio`, `midi`, `paper`.
- Tunebooks: previous / next menu, shared file header, edits kept per tune, pasting several tunes adds them to the book.
- Practice tools applied immediately: transposition (score, sound, chord names), swing (50–75 %), chords off, metronome following the meter, one-bar count-in.
- Count-in played once in loop mode; cursor in sync with the count-in.
- Voices accordion: mute, solo, unmute all — remembered by voice name.
- Click a note while playing to jump to it; keyboard play / pause; one player at a time.
- MIDI, ABC and whole-tunebook export; reset.
- White background behind tablature fret numbers.
- Parser warnings under the editor; French / English interface, extensible (`AbcjsFx.i18n`).
- Interface language detected from the browser; **Language** menu in <code>⋮</code>, applied live to every
  player and remembered; tooltips of the abcjs audio bar and the score's "Sheet Music" title translated;
  `AbcjsFx.setLanguage`, `forgetLanguage`, `defaultLang`.
- JavaScript API (`init`, `create`, `pauseAll`…), `abcjs-fx:render` event, extension mechanism (`AbcjsFx.plugins`).
- **Chord diagrams** extension (`abcjs-fx-diagrams.js`): chord diagrams in place of chord names, following the transposition; shapes per chord or per chord name, keyboard and touch support; computed shapes for chords missing from the library.

### Fixed (compared with v8) / Corrigé (par rapport à la v8)
- Swing had no effect (values 0.2–0.6 instead of the 50–75 abcjs expects).
- Switching tunes lost the transposition, the settings and the edits.
- Initial `chordsOff` ignored; play / pause relied on a non-existent abcjs property.
- The count-in made the cursor one bar early.
- Mouse paste in the editor did not redraw the score; the tunebook menu was never rebuilt.
- Last barline highlighted in red on load.
