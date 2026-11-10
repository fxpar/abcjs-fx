# Changelog / Historique

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
