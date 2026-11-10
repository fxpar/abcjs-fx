# Tablature

Tablatures are an abcjs feature, enabled with the `tablature` option. abcjs-fx adds a **white
background behind every fret number**, so numbers stay readable even when no string line crosses them.

```html
<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "guitar"}]}'>…</textarea>
```

<textarea data-abcjs-fx options='{"tablature": [{"instrument": "guitar"}]}'>
X:1
T:Amazing Grace
C:Traditional
M:3/4
L:1/4
Q:1/4=90
K:G
D | "G"G2 B/G/ | B2 A | "Em"G2 E | "C"D2 D | "G"G2 B/G/ | B2 A/B/ | "D"d3- | d2 B |
"G"d2 B/d/ | B2 G | "C"D2 E | G2 E | "G"D2 D | G2 B/G/ | "D"B2 A | "G"G2 |]
</textarea>

## Other instruments and tunings

abcjs knows five instruments. **The number of tab lines comes from the instrument, not from the
tuning**: for a 4-string tuning (ukulele, mandolin…), choose a 4-line instrument.

| `instrument` | Tab lines | Default tuning |
|---|:-:|---|
| `violin`, `fiddle`, `mandolin` | 4 | G D A E |
| `fiveString` (banjo) | 5 | C G D A E |
| `guitar` | 6 | E A D G B E |

Other tunings are given from the lowest string to the highest — here a low-G ukulele (G, C E A) on a
4-line instrument:

```html
<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "violin", "label": "Ukulele (low G)", "tuning": ["G,", "C", "E", "A"]}]}'>…</textarea>
```

<textarea data-abcjs-fx mode="audio" options='{"tablature": [{"instrument": "violin", "label": "Ukulele (low G)", "tuning": ["G,", "C", "E", "A"]}]}'>
X:1
T:C major scale on ukulele
M:4/4
L:1/4
K:C
C D E F | G A B c |]
</textarea>

## Reentrant tunings (high-G ukulele, banjo…)

On its own, abcjs requires strings in ascending order and rejects a high-G ukulele
(*"C string lower than G string"*). The optional **`abcjs-reentrant-tab.js`** patch lifts this limit:
load it right after abcjs, then give the tuning in the real string order.

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.2.0/src/abcjs-reentrant-tab.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.2.0/src/abcjs-fx.js"></script>

<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "violin", "label": "Ukulele (%T)", "tuning": ["G", "C", "E", "A"]}]}'>…</textarea>
```

<textarea data-abcjs-fx options='{"tablature": [{"instrument": "violin", "label": "Ukulele (%T)", "tuning": ["G", "C", "E", "A"]}]}'>
X:1
T:High-G ukulele
M:4/4
L:1/4
K:C
C D E F | G A B c | "C"[CEGc]2 "Am"[CEAA]2 | "F"[CFAA]2 "G7"[DFGB]2 | "C"[CEGc]4 |]
</textarea>

* Notes are placed on the lowest fret available; in chords, one note per string, with the smallest
  stretch — the C chord above becomes the usual `0 0 0 3`.
* The patch does not modify abcjs: it hooks into its tablature plugin when the page loads. It also works
  **without abcjs-fx**, with `ABCJS.renderAbc`. If a future abcjs version changes its internals, the
  patch disables itself (warning in the console) and abcjs behaves as before.
* Without the patch, an alternative is a low-G tuning (`["G,", "C", "E", "A"]`), as in the previous example.


### 5-string banjo

On a 5-string banjo, the 5th string (the high drone, written first in `g D G B d`) is **short**: it
starts at the 5th fret, so it is played open (`0`) or from fret `6`. With `"instrument": "fiveString"`
and a tuning whose first string is higher than the second, the patch knows it; at the same fret it
prefers the full-length strings, so melodies go to the 1st string and the drone is played open.

<textarea data-abcjs-fx mode="audio" options='{"tablature": [{"instrument": "fiveString", "label": "Banjo (%T)", "tuning": ["g", "D", "G", "B", "d"]}]}'>
X:1
T:Open G banjo: forward roll and melody
M:4/4
L:1/8
K:G
|G B g d G B g d | A B g d A B g d |
|"G"[GBdg]4 "D7"[^FAcd]4 | g2 ^g2 a2 b2 |]
</textarea>

The `stringStartFret` option gives the starting fret of every string explicitly (one value per tuning
entry), for instance `"stringStartFret": [5, 0, 0, 0, 0]`; `[0, 0, 0, 0, 0]` treats every string as
full-length.

## The white background

* Its colour can be changed in CSS: `.abcp-tab-bg { fill: #fffbe6; }`
* It needs the abcjs `add_classes` option, which abcjs-fx turns on automatically when a tablature is
  present. Give `"add_classes": false` in `options` to disable the backgrounds.
