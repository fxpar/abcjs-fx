# WordPress

The **ABC Notation** WordPress plugin is developed in its own repository:
[fxpar/abcjs-wp-plugin](https://github.com/fxpar/abcjs-wp-plugin).

Its version 7 is built on abcjs-fx: each shortcode produces the [div form](attributes.md#the-div-form)
of a player, so every feature described in this documentation is available in WordPress.

| Shortcode | Mode |
|---|---|
| `[abcjs]…[/abcjs]` | `paper` |
| `[abcjs-audio]…[/abcjs-audio]` | `audio` |
| `[abcjs-midi]…[/abcjs-midi]` | `midi` |
| `[abcjs-editor]…[/abcjs-editor]` | `editor` |

The shortcodes accept the same settings as the attributes of this documentation (`options`,
`synth-options`, `animate`, `chord-diag`, `lang`, `class-paper`, `class-audio`), plus `file` to load an
`.abc` file from the media library.

```text
[abcjs-audio options='{"tablature":&#91;{"instrument":"guitar"}&#93;}']
X:1
T:My tune
K:G
GABc d2B2|]
[/abcjs-audio]
```

?> WordPress forbids `[` and `]` inside shortcode attributes: write them `&#91;` and `&#93;`.
