# Modes d'affichage

L'attribut `mode` choisit ce que montre le lecteur.

| `mode` | Partition | Lecteur audio | Panneau <code>⋮</code> | Éditeur ABC |
|---|:-:|:-:|:-:|:-:|
| `editor` *(défaut)* | ✓ | ✓ | ✓ | ✓ |
| `audio` | ✓ | ✓ | ✓ | – |
| `midi` | – | ✓ | ✓ | – |
| `paper` | ✓ | – | – | – |

## `editor` — tout

Le code ABC est modifiable dans le panneau <code>⋮</code> ; la partition se redessine pendant la frappe
et les avertissements d'abcjs s'affichent sous l'éditeur.

<textarea data-abcjs-fx>
X:1
T:Ode à la joie (editor)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>

## `audio` — partition et lecteur, sans éditeur

```html
<textarea data-abcjs-fx mode="audio">…</textarea>
```

<textarea data-abcjs-fx mode="audio">
X:1
T:Ode à la joie (audio)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>

## `midi` — lecteur seul

<textarea data-abcjs-fx mode="midi">
X:1
T:Ode à la joie (midi)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>

## `paper` — partition seule

Tous les morceaux d'un recueil sont dessinés les uns après les autres.

<textarea data-abcjs-fx mode="paper">
X:1
T:Ode à la joie (paper)
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |]
</textarea>
