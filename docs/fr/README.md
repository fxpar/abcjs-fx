# abcjs-fx

**Un lecteur et éditeur de musique ABC prêt à l'emploi, basé sur [abcjs](https://www.abcjs.net/).**
Écrivez votre morceau en notation ABC dans un `<textarea>` : abcjs-fx le transforme en partition avec
lecteur audio, menu de recueil et outils de travail — sans compilation, un seul script.

<textarea data-abcjs-fx chord-diag="true">
X:1
T:Au clair de la lune
C:Traditionnel
M:4/4
L:1/4
Q:1/4=100
K:C
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |
"Dm"D D D D | "Am"A,2 A,2 | "G7"D C B, A, | "G"G,4 |
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |]
</textarea>

<div class="tip-try">

**À essayer :** cliquez sur la partition pour lancer / suspendre ; pendant la lecture, cliquez sur une
note pour y sauter. Le bouton <code>⋮</code> ouvre la transposition, le swing, le métronome, le décompte,
l'export MIDI et l'éditeur ABC en direct.

</div>

## Fonctionnalités

| | |
|---|---|
| 🎼 **Partition + audio** | Partition, synthétiseur, curseur animé, clic pour jouer, clic sur une note pour y aller |
| 📚 **Recueils** | Plusieurs morceaux `X:` → menu précédent / suivant, en-tête commun, collage d'un recueil entier |
| 🎚️ **Outils de travail** | Transposition (partition + son + accords), swing, accords coupés, métronome, décompte |
| 🔇 **Voix** | Couper ou écouter seule chaque voix d'une partition à plusieurs voix |
| 🎸 **Tablature** | Tablatures abcjs avec des numéros de case lisibles (fond blanc) |
| 💾 **Export** | MIDI, ABC du morceau, recueil complet |
| ✍️ **Éditeur en direct** | Le code ABC est modifiable, la partition suit la frappe ; avertissements affichés |
| 🪕 **Diagrammes d'accords** *(extension)* | Diagrammes à la place des noms d'accords, suivent la transposition, forme par accord |
| 🌍 **FR / EN** | Interface en français ou en anglais |

## En trois lignes

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/abcjs-audio.css">
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.3.0/src/abcjs-fx.js"></script>

<textarea data-abcjs-fx>
X:1
T:Mon morceau
K:C
CDEF GABc|]
</textarea>
```

Suite : [Démarrage rapide](fr/getting-started.md).
