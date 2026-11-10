# Tablature

Les tablatures sont une fonctionnalité d'abcjs, activée par l'option `tablature`. abcjs-fx ajoute un
**fond blanc derrière chaque numéro de case** : les chiffres restent lisibles même quand aucune ligne de
corde ne les traverse.

```html
<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "guitar"}]}'>…</textarea>
```

<textarea data-abcjs-fx options='{"tablature": [{"instrument": "guitar"}]}'>
X:1
T:Amazing Grace
C:Traditionnel
M:3/4
L:1/4
Q:1/4=90
K:G
D | "G"G2 B/G/ | B2 A | "Em"G2 E | "C"D2 D | "G"G2 B/G/ | B2 A/B/ | "D"d3- | d2 B |
"G"d2 B/d/ | B2 G | "C"D2 E | G2 E | "G"D2 D | G2 B/G/ | "D"B2 A | "G"G2 |]
</textarea>

## Autres instruments et accordages

abcjs connaît `violin`, `fiddle`, `mandolin`, `guitar` et `fiveString` (banjo) ; d'autres accordages
peuvent être donnés, de la corde la plus grave à la plus aiguë — ici un ukulélé à Sol grave (G, C E A) :

```html
<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "guitar", "label": "Ukulélé (Sol grave)", "tuning": ["G,", "C", "E", "A"]}]}'>…</textarea>
```

<textarea data-abcjs-fx mode="audio" options='{"tablature": [{"instrument": "guitar", "label": "Ukulélé (Sol grave)", "tuning": ["G,", "C", "E", "A"]}]}'>
X:1
T:Gamme de Do au ukulélé
M:4/4
L:1/4
K:C
C D E F | G A B c |]
</textarea>

!> abcjs exige des cordes en ordre croissant : un ukulélé rentrant (Sol aigu) ne peut donc pas être
décrit en tablature. Pour les **diagrammes d'accords** au ukulélé (accordage rentrant compris), voir
[Diagrammes d'accords](fr/chord-diagrams.md).

## Le fond blanc

* Sa couleur se change en CSS : `.abcp-tab-bg { fill: #fffbe6; }`
* Il utilise l'option abcjs `add_classes`, qu'abcjs-fx active automatiquement en présence d'une
  tablature. Indiquez `"add_classes": false` dans `options` pour supprimer les fonds.
