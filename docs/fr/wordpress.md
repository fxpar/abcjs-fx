# WordPress

Le plugin WordPress **ABC Notation** est développé dans son propre dépôt :
[fxpar/abcjs-wp-plugin](https://github.com/fxpar/abcjs-wp-plugin).

Sa version 7 est construite sur abcjs-fx : chaque shortcode produit la [forme div](fr/attributes.md#la-forme-div)
d'un lecteur, donc toutes les fonctionnalités décrites dans cette documentation sont disponibles dans
WordPress.

| Shortcode | Mode |
|---|---|
| `[abcjs]…[/abcjs]` | `paper` |
| `[abcjs-audio]…[/abcjs-audio]` | `audio` |
| `[abcjs-midi]…[/abcjs-midi]` | `midi` |
| `[abcjs-editor]…[/abcjs-editor]` | `editor` |

Les shortcodes acceptent les mêmes réglages que les attributs de cette documentation (`options`,
`synth-options`, `animate`, `chord-diag`, `lang`, `class-paper`, `class-audio`), plus `file` pour charger
un fichier `.abc` de la médiathèque.

```text
[abcjs-audio options='{"tablature":&#91;{"instrument":"guitar"}&#93;}']
X:1
T:Mon morceau
K:G
GABc d2B2|]
[/abcjs-audio]
```

?> WordPress interdit `[` et `]` dans les attributs de shortcode : écrivez-les `&#91;` et `&#93;`.
