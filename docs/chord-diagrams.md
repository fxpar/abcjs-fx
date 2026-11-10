# Chord diagrams in the score (extension)

The **diagrams** extension replaces the chord names of the score by **fingering diagrams**, at the very
place of the chord symbols. It is a separate script, because its chord library weighs ~115 kB: load it
only on the pages that need it.

<textarea data-abcjs-fx chord-diagrams="ukulele">
X:1
T:I – vi – IV – V on ukulele
M:4/4
L:1/4
Q:1/4=100
K:C
"C"c2 e2 | "Am"A2 c2 | "F"F2 A2 | "G7"G2 B2 |
"C"c2 "Em"B2 | "Dm7"A2 "G7"G2 | "C"c4 |]
</textarea>

## Setup

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.1.1/src/abcjs-fx.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.1.1/src/chord-library.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.1.1/src/abcjs-fx-diagrams.js"></script>

<textarea data-abcjs-fx chord-diagrams="ukulele">…</textarea>
```

The order matters: `abcjs-fx.js`, then `chord-library.js`, then `abcjs-fx-diagrams.js`.

| Attribute | Values |
|---|---|
| `chord-diagrams` | `ukulele`, `guitar`, `baritone`, `mandolin`, or a tuning such as `"D,G,B,E"` |
| `diagram-size` | room reserved for the diagrams, in points (default `44`) |

## How it works

Paul Rosen, the author of abcjs, suggested displaying diagrams by using a very large chord font, so
that abcjs reserves the room above the staff. The extension does exactly that (`format.gchordfont`), then draws an
SVG diagram where each chord name was.

* **Transposition**: the names read are the ones abcjs displays, already transposed — the diagrams
  follow the <code>⋮</code> transposition. Try +2 on the example above.
* **Playback**: the diagram of the chord being played lights up with the cursor.
* **Shapes**: the curated shapes of `chord-library.js` come first; chords missing from the library
  (`dim`, `aug`, `m(maj7)`, `maj7(#5)`, `7#5`, slash chords…) get **computed shapes**, marked with `*`.
  All chord tones are present, within a 4-fret span, with at most 4 fingers, and the right bass note on
  guitar.

## Guitar, with slash chords

<textarea data-abcjs-fx chord-diagrams="guitar" diagram-size="52" mode="audio">
X:1
T:Descending bass on guitar
M:4/4
L:1/4
K:G
"G"G2 B2 | "D/F#"A2 d2 | "Em"G2 B2 | "C"E2 G2 | "Am7"A2 c2 | "D7"F2 A2 | "G"G4 |]
</textarea>

## Chord spellings understood

`C`, `Cm`, `Cdim` / `C°`, `Caug` / `C+`, `C7`, `Cmaj7` / `CM7` / `CΔ`, `Cm7` / `C-7`, `Cm7b5` / `Cø`,
`Cdim7` / `C°7`, `Cm(maj7)`, `Cmaj7(#5)`, `C7#5`, `C7b5`, `C6`, `Cm6`, `Csus2`, `Csus4`, `C7sus4`,
`Cadd9`, `C9`, `Cmaj9`, `Cm9`, `C7b9`, `C11`, `C13`, `C5`, slash chords `C/E`. Sharps and flats: `C#`,
`Db`, `C♯`, `D♭`. Quoted text that is not a chord is shown as normal text.

Next: [Changing shapes](chord-shapes.md).
