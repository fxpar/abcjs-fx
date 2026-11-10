# Getting started

## 1. Load the scripts

abcjs-fx needs the official [abcjs](https://www.abcjs.net/) library (6.4 or later), loaded **before** it.

```html
<!-- abcjs -->
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/abcjs-audio.css">

<!-- abcjs-fx player -->
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.4.0/src/abcjs-fx.js"></script>
```

?> You can also download `src/abcjs-fx.js` from the [repository](https://github.com/fxpar/abcjs-fx)
and host it yourself. There is no build step and no other dependency.

## 2. Write a tune

Put ABC notation in a `<textarea data-abcjs-fx>`. When the page loads, the textarea is replaced by
the player — and moved inside its <code>⋮</code> panel, where it becomes the live editor.

```html
<textarea data-abcjs-fx>
X:1
T:Ode to Joy
C:L. van Beethoven
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |
F F G A | A G F E | D D E F | E3/2 D/ D2 |]
</textarea>
```

<textarea data-abcjs-fx>
X:1
T:Ode to Joy
C:L. van Beethoven
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |
F F G A | A G F E | D D E F | E3/2 D/ D2 |]
</textarea>

## 3. Pass abcjs options (optional)

The `options` attribute takes **JSON**. It is given to abcjs for both rendering and audio, so every
[abcjs option](https://paulrosen.github.io/abcjs/visual/render-abc-options.html) works:

```html
<textarea data-abcjs-fx options='{"staffwidth": 500, "scale": 0.9}'>…</textarea>
```

See all the attributes in the [Attributes reference](attributes.md).

## Which elements become players?

| Element | Use |
|---|---|
| `<textarea data-abcjs-fx>` | recommended |
| `<div class="abcjs-fx" data-abc='"…json…"'>` | generated markup, e.g. by a CMS — see [Attributes](attributes.md#the-div-form) |

?> **Former names still work**, so existing pages need no change: `<textarea data-abcplayer>`,
`<textarea id="abc_ex_…">` (versions 6 – 8), `<div class="abcplayer9" data-abc>`, `window.AbcPlayer9`
and the `abcplayer9:render` event.

Content added after the page has loaded (Ajax, single-page apps…) is initialised with
`AbcjsFx.init(container)` — see the [JavaScript API](api.md).
