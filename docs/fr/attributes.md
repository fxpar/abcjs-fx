# Attributs

Les attributs se placent sur le `<textarea>`. Sur un `<div class="abcjs-fx">`, utilisez le préfixe
`data-` (`data-mode`, `data-options`…).

## Lecteur (`abcjs-fx.js`)

| Attribut | Valeurs | Défaut | Description |
|---|---|---|---|
| `data-abcjs-fx` | – | – | désigne le textarea comme lecteur |
| `mode` | `editor` `audio` `midi` `paper` | `editor` | ce qui est affiché — voir [Modes d'affichage](fr/modes.md) |
| `options` | JSON | `{}` | options abcjs, pour le rendu **et** le son (`responsive`, `staffwidth`, `tablature`, `swing`, `chordsOff`, `format`…) |
| `synth-options` | JSON | `{}` | options abcjs réservées au son (`program`, `qpm`, `soundFontUrl`, `defaultQpm`…) |
| `animate` | `true` `false` | `true` | curseur animé et notes surlignées |
| `chord-diag` | `true` `false` | `false` | liste des accords (transposés) au-dessus de la partition |
| `class-paper` | classes CSS | – | classes ajoutées à la partition |
| `class-audio` | classes CSS | – | classes ajoutées à la barre audio |
| `tab-menu` | `true` `false` | `true` | champ **Tablature** du panneau <code>⋮</code> — voir [Tablature](fr/tablature.md#choisir-la-tablature-dans-le-lecteur) |
| `tab-instruments` | identifiants séparés par des virgules | tous | choix proposés : `guitar` `guitar-dropd` `ukulele` `ukulele-lowg` `mandolin` `violin` `banjo` `custom` |
| `lang` | `fr` `en` … | langue du navigateur | langue de l'interface, tant que le lecteur n'en a pas choisi une dans <code>⋮</code> — voir [Styles et langues](fr/customization.md) |

## Diagrammes d'accords (`abcjs-fx-diagrams.js`)

| Attribut | Valeurs | Défaut | Description |
|---|---|---|---|
| `chord-diagrams` | `ukulele` `guitar` `baritone` `mandolin` ou un accordage `"D,G,B,E"` | – | remplace les noms d'accords par des diagrammes |
| `diagram-size` | nombre | `44` | hauteur réservée aux diagrammes (taille de la police d'accords) |

## La forme div

Pour le balisage généré (par exemple par un CMS). `data-abc` contient le texte ABC **encodé en chaîne
JSON**, ce qui le fait tenir sur une ligne :

```html
<div class="abcjs-fx" data-mode="audio" lang="fr"
     data-abc='"X:1\nT:Bonjour\nK:C\nCDEF GABc|]"'
     data-options='{"responsive":"resize"}'></div>
```

<div class="abcjs-fx" data-mode="audio" lang="fr" data-abc='"X:1\nT:Bonjour\nK:C\nCDEF GABc|]"' data-options='{"responsive":"resize"}'></div>

?> `options` est lu en JSON. L'ancienne forme objet JavaScript (`{responsive: 'resize'}`) reste acceptée
par compatibilité, avec un avertissement dans la console.
