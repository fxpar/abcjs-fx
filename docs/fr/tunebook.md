# Recueils

Placez plusieurs morceaux (plusieurs lignes `X:`) dans le même textarea : une barre
**Précédent / menu / Suivant** apparaît au-dessus de la partition. Le menu reprend les titres `T:`.

<textarea data-abcjs-fx>
%%MIDI program 73
X:1
T:Frère Jacques
M:4/4
L:1/4
K:F
F G A F | F G A F | A B c2 | A B c2 |
c/d/c/B/ A F | c/d/c/B/ A F | F C F2 | F C F2 |]
X:2
T:Ah ! vous dirai-je, maman
M:4/4
L:1/4
K:C
C C G G | A A G2 | F F E E | D D C2 |
G G F F | E E D2 | G G F F | E E D2 |
C C G G | A A G2 | F F E E | D D C2 |]
X:3
T:Au clair de la lune
M:4/4
L:1/4
K:G
G G G A | B2 A2 | G B A A | G4 |]
</textarea>

## En-tête commun

Les directives placées **avant le premier `X:`** (lignes `%%…` et champs d'en-tête) s'appliquent à tous
les morceaux — ci-dessus, `%%MIDI program 73` fait jouer tout le recueil à la flûte.

```abc
%%MIDI program 73
X:1
T:Premier morceau
…
X:2
T:Deuxième morceau
…
```

## Modifier un recueil

* Les modifications faites dans l'éditeur sont **conservées par morceau** : changer de morceau puis
  revenir ne les perd pas.
* Les réglages (transposition, swing, voix coupées…) suivent d'un morceau à l'autre.
* **Coller** dans l'éditeur un texte contenant plusieurs morceaux les ajoute au recueil à la place du
  morceau courant, et le menu est reconstruit.
* <code>⋮</code> → **Recueil complet** télécharge le recueil avec vos modifications (voir [Export](fr/export.md)).

?> Les morceaux sont séparés par les lignes commençant par `X:` ; les lignes vides entre morceaux sont facultatives.
