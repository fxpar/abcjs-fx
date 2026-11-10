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

## Défilement automatique

Pendant la lecture, quand la ligne jouée sort de la partie confortable de l'écran, la page défile en
douceur pour la ramener vers le haut — pratique pour les longs morceaux sur petit écran. Rien ne bouge
tant que la ligne est bien visible, et le lecteur cesse de suivre pendant quelques secondes quand on fait
défiler la page à la main.

* Chaque lecteur a une case **Défilement auto** dans <code>⋮</code> ; la décocher ne concerne que ce lecteur.
* `auto-scroll="false"` sur un exercice le désactive par défaut (le lecteur peut le réactiver) ;
  `AbcjsFx.autoScroll = false` fait de même pour tout un site.
* Il fonctionne aussi dans un bloc défilant (sites dont le contenu défile dans un cadre), pas seulement
  dans la fenêtre.

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
