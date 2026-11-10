# abcjs-fx

**A drop-in ABC music player and editor built on [abcjs](https://www.abcjs.net/).**
Write your tune in ABC notation inside a `<textarea>`: abcjs-fx turns it into sheet music with an
audio player, a tunebook menu and a set of practice tools — no build step, one script.

<textarea data-abcjs-fx chord-diag="true">
X:1
T:Au clair de la lune
C:Traditional
M:4/4
L:1/4
Q:1/4=100
K:C
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |
"Dm"D D D D | "Am"A,2 A,2 | "G7"D C B, A, | "G"G,4 |
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |]
</textarea>

<div class="tip-try">

**Try it:** click the score to play / pause; while it plays, click a note to jump to it.
Open <code>⋮</code> for transposition, swing, metronome, count-in, MIDI export and the live ABC editor.

</div>

## Features

| | |
|---|---|
| 🎼 **Score + audio** | Sheet music, synthesizer, animated cursor, click-to-play, click a note to jump |
| 📚 **Tunebooks** | Several `X:` tunes → previous / next menu, shared file header, paste a whole book |
| 🎚️ **Practice tools** | Transposition (score + audio + chord names), swing, chords off, metronome, count-in |
| 🔇 **Voices** | Mute or solo each voice of a multi-voice score |
| 🎸 **Tablature** | abcjs tablatures with readable fret numbers (white background) |
| 💾 **Export** | MIDI, ABC of the tune, whole tunebook |
| ✍️ **Live editor** | Edit the ABC code, the score updates as you type; parser warnings shown |
| 🪕 **Chord diagrams** *(extension)* | Diagrams in place of chord names, follow transposition, change shapes per chord |
| 🌍 **FR / EN** | Interface in French or English |

## In three lines

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/abcjs-audio.css">
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.2.0/src/abcjs-fx.js"></script>

<textarea data-abcjs-fx>
X:1
T:My tune
K:C
CDEF GABc|]
</textarea>
```

Next: [Getting started](getting-started.md).
