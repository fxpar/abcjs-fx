# Attributes

Attributes go on the `<textarea>`. On a `<div class="abcjs-fx">`, use the `data-` prefix
(`data-mode`, `data-options`…).

## Player (`abcjs-fx.js`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `data-abcjs-fx` | – | – | marks the textarea as a player |
| `mode` | `editor` `audio` `midi` `paper` | `editor` | what is shown — see [Display modes](modes.md) |
| `options` | JSON | `{}` | abcjs options, for rendering **and** audio (`responsive`, `staffwidth`, `tablature`, `swing`, `chordsOff`, `format`…) |
| `synth-options` | JSON | `{}` | audio-only abcjs options (`program`, `qpm`, `soundFontUrl`, `defaultQpm`…) |
| `animate` | `true` `false` | `true` | animated cursor and highlighted notes |
| `chord-diag` | `true` `false` | `false` | list of the chords (transposed) above the score |
| `class-paper` | CSS classes | – | extra classes on the score |
| `class-audio` | CSS classes | – | extra classes on the audio bar |
| `lang` | `fr` `en` … | browser language | interface language, until the reader picks one in <code>⋮</code> — see [Styling & languages](customization.md) |

## Chord diagrams (`abcjs-fx-diagrams.js`)

| Attribute | Values | Default | Description |
|---|---|---|---|
| `chord-diagrams` | `ukulele` `guitar` `baritone` `mandolin` or a tuning `"D,G,B,E"` | – | turns the chord names into diagrams |
| `diagram-size` | number | `44` | height reserved for the diagrams (chord font size) |

## The div form

Used for generated markup (for instance by a CMS). `data-abc` holds the ABC text **encoded as a JSON
string**, so it fits on one line:

```html
<div class="abcjs-fx" data-mode="audio" lang="en"
     data-abc='"X:1\nT:Hello\nK:C\nCDEF GABc|]"'
     data-options='{"responsive":"resize"}'></div>
```

<div class="abcjs-fx" data-mode="audio" lang="en" data-abc='"X:1\nT:Hello\nK:C\nCDEF GABc|]"' data-options='{"responsive":"resize"}'></div>

?> `options` is read as JSON. The former JavaScript-object form (`{responsive: 'resize'}`) is still
accepted for compatibility, with a warning in the console.
