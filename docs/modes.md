# Display modes

The `mode` attribute chooses what the player shows.

| `mode` | Score | Audio player | <code>⋮</code> panel | ABC editor |
|---|:-:|:-:|:-:|:-:|
| `editor` *(default)* | ✓ | ✓ | ✓ | ✓ |
| `audio` | ✓ | ✓ | ✓ | – |
| `midi` | – | ✓ | ✓ | – |
| `paper` | ✓ | – | – | – |

## `editor` — everything

The ABC code is editable in the <code>⋮</code> panel; the score is redrawn as you type and abcjs
parser warnings are listed under the editor.

<textarea data-abcjs-fx>
X:1
T:Ode to Joy (editor)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>

## `audio` — score and player, no editor

```html
<textarea data-abcjs-fx mode="audio">…</textarea>
```

<textarea data-abcjs-fx mode="audio">
X:1
T:Ode to Joy (audio)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>

## `midi` — player only

<textarea data-abcjs-fx mode="midi">
X:1
T:Ode to Joy (midi)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>

## `paper` — score only

All the tunes of a tunebook are drawn one after the other.

<textarea data-abcjs-fx mode="paper">
X:1
T:Ode to Joy (paper)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>
