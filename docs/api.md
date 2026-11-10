# JavaScript API & events

Everything is exposed on `window.AbcjsFx` (also available under its former name `window.AbcPlayer9`).

## Initialising

```js
// Players are created automatically when the page loads.
// For content added later (Ajax, single-page apps):
AbcjsFx.init(document.querySelector("#new-content")); // returns the new players

// Without markup:
var player = AbcjsFx.create({
  container: document.getElementById("here"), // or before: someElement
  abc: "X:1\nT:Hello\nK:C\nCDEF GABc|]",
  mode: "audio",          // editor | audio | midi | paper
  options: { staffwidth: 500 },
  synthOptions: { program: 24 },
  animate: true,
  lang: "en"
});
```

An element is never initialised twice (`data-abcp-ready` is set on it).

## Global functions

| | |
|---|---|
| `AbcjsFx.version` | `"9.1.0"` |
| `AbcjsFx.players` | every player created |
| `AbcjsFx.pauseAll(except)` | pauses every player but `except` |
| `AbcjsFx.splitTunebook(text)` | `{header, prefix, tunes:[{abc, title}]}` |
| `AbcjsFx.transposeChord("F#m7/C#", 2)` | `"G#m7/D#"` |
| `AbcjsFx.i18n` | interface strings, per language |
| `AbcjsFx.setLanguage(code, {remember})` | changes the language of every player (remembered by default) |
| `AbcjsFx.forgetLanguage()` | forgets the reader's choice |
| `AbcjsFx.defaultLang` | site default language, used before the browser's (set it before the players are created) |
| `AbcjsFx.resolveLang(element)` | the language a new player would get |

## A player

| | |
|---|---|
| `player.togglePlay()` / `player.pause()` | playback |
| `player.isPlaying()` | `true` while playing |
| `player.loadTune(index)` | show another tune of the book |
| `player.tunes`, `player.current` | the book and the index of the tune shown |
| `player.state` | `{transpose, swing, chordsOff, metronome, countIn, muted}` |
| `player.voiceList()` | voice names, in abcjs order |
| `player.lang`, `player.setLanguage(code)` | interface language of this player only |
| `player.editor` | the underlying `ABCJS.Editor` |
| `player.root`, `player.paperEl`, `player.textarea` | DOM elements |

## Event

After every drawing, the player's root element dispatches `abcjs-fx:render` (it bubbles):

```js
document.addEventListener("abcjs-fx:render", function (e) {
  var d = e.detail;   // { player, tune (abcjs visual object), chords: ["C", "G7", …] }
  console.log(d.player.tunes[d.player.current].title, d.chords);
});
```

## Showing your own chord charts

With `chord-diag="true"`, the list of chords is drawn by `AbcjsFx.chordDiagramRenderer` when it is
defined:

```js
AbcjsFx.chordDiagramRenderer = function (element, chords, player) {
  element.innerHTML = chords.map(function (c) { return "<b>" + c + "</b>"; }).join(" · ");
};
```

## Extensions

`abcjs-fx-diagrams.js` is built on this mechanism; you can write your own:

```js
AbcjsFx.plugins.push({
  configure: function (player, cfg) {   // before the first drawing
    // cfg.attr("my-attribute") reads an attribute of the source element
    player.options.staffwidth = 600;
  },
  afterRender: function (player) {      // after every drawing
    // player.paperEl contains the SVG
  }
});
```

Register the extension **before** the players are created (load it right after `abcjs-fx.js`).

## Chord tools (extension)

```js
AbcjsFx.diagrams.parseChord("Bbm7b5");      // {root, suffix, pcs, bass, …}
AbcjsFx.diagrams.shapesFor("guitar", "C/E"); // [{abs:[0,3,2,0,1,0], source:"generated"}, …]
AbcjsFx.diagrams.instruments;                // tunings
```
