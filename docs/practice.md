# Practice tools

Open <code>⋮</code> under the player. Every setting applies immediately (playback pauses; press play again).

<textarea data-abcjs-fx chord-diag="true">
X:1
T:When the Saints Go Marching In
C:Traditional
M:4/4
L:1/4
Q:1/4=120
K:C
z C E F | "C"G4 | z C E F | G4 | z C E F | G2 E2 | C2 E2 | "G7"D4 |
z E E D | "C"C3 C | E2 G2 | "C7"G "F"F3 | z E F G | "C"E2 C2 | "G7"D2 D2 | "C"C4 |]
</textarea>

## Transposition

From −12 to +12 semitones. The **score**, the **sound** and the **chord names** are transposed together
(the chord list shown with `chord-diag="true"` follows too).

## Swing

| Setting | abcjs value | Feel |
|---|---|---|
| None | 50 | straight eighths |
| Light | 58 | |
| Triplet | 66 | 2:1, jazz / shuffle |
| Hard | 75 | dotted eighth + sixteenth |

?> Swing works in X/4 and X/8 meters. An initial value can be given with `options='{"swing": 66}'`.

## Chords off

Plays the melody without the accompaniment generated from the chord symbols.

## Metronome

A click on every beat, with an accent on the first beat. The pattern is computed from the `M:` meter
(6/8 is counted in two dotted-quarter beats).

## Count-in

One bar of clicks before the music starts. The cursor waits for the end of the count-in, and in
**loop** mode the count-in is only played the first time.

## Settings and tunebooks

Transposition, swing, chords off, metronome and count-in are kept when you move to another tune of
the book. **Reset** (<code>⋮</code>) restores the defaults and the original text of the current tune.
