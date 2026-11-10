# Diagrammes d'accords dans la partition (extension)

L'extension **diagrammes** remplace les noms d'accords de la partition par des **diagrammes de doigtés**, à
l'emplacement même des accords. C'est un script séparé, car sa bibliothèque d'accords pèse ~115 Ko :
chargez-le seulement sur les pages qui en ont besoin.

<textarea data-abcjs-fx chord-diagrams="ukulele">
X:1
T:I – vi – IV – V au ukulélé
M:4/4
L:1/4
Q:1/4=100
K:C
"C"c2 e2 | "Am"A2 c2 | "F"F2 A2 | "G7"G2 B2 |
"C"c2 "Em"B2 | "Dm7"A2 "G7"G2 | "C"c4 |]
</textarea>

## Installation

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.4.0/src/abcjs-fx.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.4.0/src/chord-library.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.4.0/src/abcjs-fx-diagrams.js"></script>

<textarea data-abcjs-fx chord-diagrams="ukulele">…</textarea>
```

L'ordre compte : `abcjs-fx.js`, puis `chord-library.js`, puis `abcjs-fx-diagrams.js`.

| Attribut | Valeurs |
|---|---|
| `chord-diagrams` | `ukulele`, `guitar`, `baritone`, `mandolin`, ou un accordage comme `"D,G,B,E"` |
| `diagram-size` | place réservée aux diagrammes, en points (défaut `44`) |

## Principe

Paul Rosen, l'auteur d'abcjs, a suggéré d'afficher des diagrammes en donnant une très grande taille à la
police des accords, pour qu'abcjs réserve la place au-dessus de la portée. L'extension fait exactement cela
(`format.gchordfont`), puis dessine un diagramme SVG à l'emplacement de chaque nom d'accord.

* **Transposition** : les noms lus sont ceux qu'affiche abcjs, déjà transposés — les diagrammes suivent
  la transposition du panneau <code>⋮</code>. Essayez +2 sur l'exemple ci-dessus.
* **Lecture** : le diagramme de l'accord joué s'allume avec le curseur.
* **Formes** : les formes de `chord-library.js` viennent d'abord ; les accords absents de la bibliothèque
  (`dim`, `aug`, `m(maj7)`, `maj7(#5)`, `7#5`, accords avec basse…) reçoivent des **formes calculées**,
  marquées `*`. Toutes les notes de l'accord sont présentes, sur 4 cases au plus, avec 4 doigts au plus,
  et la bonne basse à la guitare.

## Guitare, avec accords « / »

<textarea data-abcjs-fx chord-diagrams="guitar" diagram-size="52" mode="audio">
X:1
T:Basse descendante à la guitare
M:4/4
L:1/4
K:G
"G"G2 B2 | "D/F#"A2 d2 | "Em"G2 B2 | "C"E2 G2 | "Am7"A2 c2 | "D7"F2 A2 | "G"G4 |]
</textarea>

## Écritures d'accords reconnues

`C`, `Cm`, `Cdim` / `C°`, `Caug` / `C+`, `C7`, `Cmaj7` / `CM7` / `CΔ`, `Cm7` / `C-7`, `Cm7b5` / `Cø`,
`Cdim7` / `C°7`, `Cm(maj7)`, `Cmaj7(#5)`, `C7#5`, `C7b5`, `C6`, `Cm6`, `Csus2`, `Csus4`, `C7sus4`,
`Cadd9`, `C9`, `Cmaj9`, `Cm9`, `C7b9`, `C11`, `C13`, `C5`, accords avec basse `C/E`. Dièses et bémols :
`C#`, `Db`, `C♯`, `D♭`. Un texte entre guillemets qui n'est pas un accord s'affiche normalement.

Suite : [Changer de forme](fr/chord-shapes.md).
