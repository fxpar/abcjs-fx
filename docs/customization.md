# Styling & languages

## Colours

The player's CSS is injected once in the page; override it with CSS variables or classes.

```css
.abcp {
  --abcp-accent: #c2185b;   /* buttons, active states */
  --abcp-border: #e0e0e0;
  --abcp-bg: #fafafa;       /* audio bar, buttons */
  --abcp-text: #222;
}
.abcp .highlight      { fill: #c2185b; }   /* notes being played */
.abcp .abcjs-cursor   { stroke: #c2185b; } /* cursor line */
.abcp-tab-bg          { fill: #fffbe6; }   /* behind tablature numbers */
```

| Class | Element |
|---|---|
| `.abcp` | the whole player (`data-mode` attribute: `editor`, `audio`, `midi`, `paper`) |
| `.abcp-nav` | tunebook bar |
| `.abcp-paper` | the score |
| `.abcp-bar`, `.abcp-audio` | audio bar |
| `.abcp-panel` | <code>⋮</code> panel |
| `.abcp-textarea`, `.abcp-warnings` | editor and parser warnings |
| `.abcp-voices` | voices accordion |
| `.abcp-dg`, `.abcp-dg-custom` | a chord diagram (extension), a customized one |

## Languages

The interface is available in **English** and **French** — the controls, the tunebook buttons and the
tooltips of the abcjs audio bar (loop, restart, play, progress, tempo).

### Choosing in the player

Open <code>⋮</code> → **Language**. The choice applies at once to **every player of the page**, without
interrupting anything, and is **remembered by the browser** for the next visits.

### Automatic language

When the reader has not chosen yet, the language is, in order:

1. the `lang` attribute of the textarea (the author's choice),
2. `AbcjsFx.defaultLang`, if the site sets it,
3. the **browser's preferred languages** (first supported one),
4. the language of the page (`<html lang>`),
5. English.

```html
<textarea data-abcjs-fx lang="fr">…</textarea>
<script>AbcjsFx.defaultLang = "fr"; // before the players are created</script>
```

<textarea data-abcjs-fx lang="fr" mode="audio">
X:1
T:Interface en français
K:C
CDEF GABc|]
</textarea>

?> On this documentation site, the examples follow the language of the page (`defaultLang`), unless you
chose a language in a <code>⋮</code> menu.

### From JavaScript

```js
AbcjsFx.setLanguage("fr");                    // every player, remembered
AbcjsFx.setLanguage("en", { remember: false }); // not remembered
AbcjsFx.forgetLanguage();                     // back to the automatic language
```

### Adding a language

Copy the English strings and translate them, before the players are created. The new language appears
in the <code>⋮</code> menu under its `langName`:

```js
AbcjsFx.i18n.de = Object.assign({}, AbcjsFx.i18n.en, {
  langName: "Deutsch", language: "Sprache",
  prev: "◀ Zurück", next: "Weiter ▶", transpose: "Transponieren (Halbtöne)",
  playTitle: "Wiedergabe / Pause"
  // …
});
```

Strings missing from a language are not filled in automatically: start from a copy of `i18n.en` as above.
