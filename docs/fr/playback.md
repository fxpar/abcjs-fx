# Lecture et curseur

<textarea data-abcjs-fx>
X:1
T:The Irish Washerwoman
R:gigue
C:Traditionnel
M:6/8
L:1/8
Q:3/8=100
K:G
|:dc|BGG DGG|BGB dcB|cAA EAA|cAc edc|
BGG DGG|BGB dcB|cBc Adc|BGG G:|
</textarea>

| Action | Résultat |
|---|---|
| Clic sur la partition (hors note) | Lecture / pause |
| Clic sur une note **pendant la lecture** | Saut à cette note |
| Clic sur une note à l'arrêt | mode `editor` : sélectionne son code ABC · autres modes : joue depuis cette note |
| <kbd>Espace</kbd> / <kbd>Entrée</kbd> sur la partition (focus) | Lecture / pause |
| Barre audio | Retour au début, boucle, progression (clic pour se déplacer), tempo en % |

## Curseur animé

Un trait rouge suit la musique et les notes jouées sont surlignées. Pour le désactiver :
`animate="false"`.

```html
<textarea data-abcjs-fx animate="false">…</textarea>
```

## Un seul lecteur à la fois

Lancer un lecteur met les autres de la page en pause. Essayez avec les deux lecteurs ci-dessous.

<textarea data-abcjs-fx mode="audio">
X:1
T:Gamme montante
M:4/4
L:1/8
K:C
CDEF GABc | c8 |]
</textarea>

<textarea data-abcjs-fx mode="audio">
X:1
T:Gamme descendante
M:4/4
L:1/8
K:C
cBAG FEDC | C8 |]
</textarea>
