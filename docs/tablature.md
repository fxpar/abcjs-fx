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

abcjs knows `violin`, `fiddle`, `mandolin`, `guitar` and `fiveString` (banjo); other tunings can be
given, from the lowest string to the highest — here a low-G ukulele (G, C E A):

```html
<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "guitar", "label": "Ukulele (low G)", "tuning": ["G,", "C", "E", "A"]}]}'>…</textarea>
```

<textarea data-abcjs-fx mode="audio" options='{"tablature": [{"instrument": "guitar", "label": "Ukulele (low G)", "tuning": ["G,", "C", "E", "A"]}]}'>
X:1
T:C major scale on ukulele
M:4/4
L:1/4
K:C
C D E F | G A B c |]
</textarea>

!> abcjs requires strings in ascending order, so a re-entrant ukulele (high G) cannot be described as a
tablature. For ukulele **chord diagrams** (re-entrant tuning included), see [Chord diagrams](chord-diagrams.md).

## The white background

* Its colour can be changed in CSS: `.abcp-tab-bg { fill: #fffbe6; }`
* It needs the abcjs `add_classes` option, which abcjs-fx turns on automatically when a tablature is
  present. Give `"add_classes": false` in `options` to disable the backgrounds.
