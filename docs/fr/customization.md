# Styles et langues

## Couleurs

Le CSS du lecteur est injecté une fois dans la page ; surchargez-le avec des variables CSS ou des classes.

```css
.abcp {
  --abcp-accent: #c2185b;   /* boutons, états actifs */
  --abcp-border: #e0e0e0;
  --abcp-bg: #fafafa;       /* barre audio, boutons */
  --abcp-text: #222;
}
.abcp .highlight      { fill: #c2185b; }   /* notes jouées */
.abcp .abcjs-cursor   { stroke: #c2185b; } /* trait du curseur */
.abcp-tab-bg          { fill: #fffbe6; }   /* derrière les chiffres de tablature */
```

| Classe | Élément |
|---|---|
| `.abcp` | le lecteur entier (attribut `data-mode` : `editor`, `audio`, `midi`, `paper`) |
| `.abcp-nav` | barre du recueil |
| `.abcp-paper` | la partition |
| `.abcp-bar`, `.abcp-audio` | barre audio |
| `.abcp-panel` | panneau <code>⋮</code> |
| `.abcp-textarea`, `.abcp-warnings` | éditeur et avertissements |
| `.abcp-voices` | accordéon des voix |
| `.abcp-dg`, `.abcp-dg-custom` | un diagramme d'accord (extension), un diagramme personnalisé |

## Langues

L'interface existe en **français** et en **anglais** — les commandes, les boutons du recueil et les
infobulles de la barre audio d'abcjs (boucle, retour au début, lecture, progression, tempo).

### Choisir dans le lecteur

Ouvrez <code>⋮</code> → **Langue**. Le choix s'applique aussitôt à **tous les lecteurs de la page**, sans
rien interrompre, et il est **mémorisé par le navigateur** pour les visites suivantes.

### Langue automatique

Tant que le lecteur n'a rien choisi, la langue est, dans l'ordre :

1. l'attribut `lang` du textarea (choix de l'auteur),
2. `AbcjsFx.defaultLang`, si le site le définit,
3. les **langues préférées du navigateur** (la première prise en charge),
4. la langue de la page (`<html lang>`),
5. l'anglais.

```html
<textarea data-abcjs-fx lang="en">…</textarea>
<script>AbcjsFx.defaultLang = "fr"; // avant la création des lecteurs</script>
```

<textarea data-abcjs-fx lang="en" mode="audio">
X:1
T:English interface
K:C
CDEF GABc|]
</textarea>

?> Sur ce site de documentation, les exemples suivent la langue de la page (`defaultLang`), sauf si vous
avez choisi une langue dans un menu <code>⋮</code>.

### En JavaScript

```js
AbcjsFx.setLanguage("fr");                    // tous les lecteurs, mémorisé
AbcjsFx.setLanguage("en", { remember: false }); // non mémorisé
AbcjsFx.forgetLanguage();                     // retour à la langue automatique
```

### Ajouter une langue

Copiez les textes anglais et traduisez-les, avant la création des lecteurs. La nouvelle langue apparaît
dans le menu <code>⋮</code> sous son `langName` :

```js
AbcjsFx.i18n.de = Object.assign({}, AbcjsFx.i18n.en, {
  langName: "Deutsch", language: "Sprache",
  prev: "◀ Zurück", next: "Weiter ▶", transpose: "Transponieren (Halbtöne)",
  playTitle: "Wiedergabe / Pause"
  // …
});
```

Les textes absents d'une langue ne sont pas complétés automatiquement : partez d'une copie de `i18n.en`
comme ci-dessus.
