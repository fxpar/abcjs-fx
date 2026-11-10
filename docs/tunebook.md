# Tunebooks

Put several tunes (several `X:` lines) in the same textarea: a **Previous / menu / Next** bar
appears above the score. The menu uses the `T:` titles.

<textarea data-abcjs-fx>
%%MIDI program 73
X:1
T:Frère Jacques
M:4/4
L:1/4
K:F
F G A F | F G A F | A B c2 | A B c2 |
c/d/c/B/ A F | c/d/c/B/ A F | F C F2 | F C F2 |]
X:2
T:Twinkle, Twinkle, Little Star
M:4/4
L:1/4
K:C
C C G G | A A G2 | F F E E | D D C2 |
G G F F | E E D2 | G G F F | E E D2 |
C C G G | A A G2 | F F E E | D D C2 |]
X:3
T:Au clair de la lune
M:4/4
L:1/4
K:G
G G G A | B2 A2 | G B A A | G4 |]
</textarea>

## Shared file header

Directives placed **before the first `X:`** (`%%…` lines and header fields) apply to every tune —
above, `%%MIDI program 73` plays the whole book with a flute sound.

```abc
%%MIDI program 73
X:1
T:First tune
…
X:2
T:Second tune
…
```

## Editing a tunebook

* Changes made in the editor are **kept per tune**: switching to another tune and back does not lose them.
* Settings (transposition, swing, muted voices…) are kept from one tune to the next.
* **Pasting** text that contains several tunes into the editor adds them to the book in place of the
  current tune, and the menu is rebuilt.
* <code>⋮</code> → **Whole tunebook** downloads the book with your edits (see [Export](export.md)).

?> The tunes are split on lines beginning with `X:`; blank lines between tunes are optional.
