# Démarrage rapide

## 1. Charger les scripts

abcjs-fx s'appuie sur la bibliothèque officielle [abcjs](https://www.abcjs.net/) (6.4 ou plus récente),
à charger **avant** lui.

```html
<!-- abcjs -->
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/abcjs-audio.css">

<!-- lecteur abcjs-fx -->
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.1.1/src/abcjs-fx.js"></script>
```

?> Vous pouvez aussi télécharger `src/abcjs-fx.js` depuis le [dépôt](https://github.com/fxpar/abcjs-fx)
et l'héberger vous-même. Aucune compilation, aucune autre dépendance.

## 2. Écrire un morceau

Placez la notation ABC dans un `<textarea data-abcjs-fx>`. Au chargement de la page, le textarea est
remplacé par le lecteur — et déplacé dans son panneau <code>⋮</code>, où il devient l'éditeur en direct.

```html
<textarea data-abcjs-fx>
X:1
T:Ode à la joie
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
T:Ode à la joie
C:L. van Beethoven
M:4/4
L:1/4
K:D
F F G A | A G F E | D D E F | F3/2 E/ E2 |
F F G A | A G F E | D D E F | E3/2 D/ D2 |]
</textarea>

## 3. Passer des options abcjs (facultatif)

L'attribut `options` attend du **JSON**. Il est transmis à abcjs pour le rendu et pour le son : toutes
les [options abcjs](https://paulrosen.github.io/abcjs/visual/render-abc-options.html) fonctionnent.

```html
<textarea data-abcjs-fx options='{"staffwidth": 500, "scale": 0.9}'>…</textarea>
```

Tous les attributs : voir la [Référence des attributs](fr/attributes.md).

## Quels éléments deviennent des lecteurs ?

| Élément | Usage |
|---|---|
| `<textarea data-abcjs-fx>` | recommandé |
| `<div class="abcjs-fx" data-abc='"…json…"'>` | balisage généré, par ex. par un CMS — voir [Attributs](fr/attributes.md#la-forme-div) |

?> **Les anciens noms fonctionnent toujours**, les pages existantes n'ont rien à changer :
`<textarea data-abcplayer>`, `<textarea id="abc_ex_…">` (versions 6 à 8), `<div class="abcplayer9" data-abc>`,
`window.AbcPlayer9` et l'événement `abcplayer9:render`.

Le contenu ajouté après le chargement (Ajax, applications monopages…) s'initialise avec
`AbcjsFx.init(conteneur)` — voir l'[API JavaScript](fr/api.md).
