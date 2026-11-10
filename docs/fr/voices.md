# Voix : couper, solo

Dès qu'un morceau a au moins deux voix, un accordéon **Voix** apparaît en bas du panneau <code>⋮</code> :

* une case à cocher par voix pour la **couper**,
* un bouton **Solo** pour écouter une voix seule (re-cliquer : toutes les voix),
* **Tout activer**.

<textarea data-abcjs-fx>
X:1
T:Frère Jacques (canon)
C:Traditionnel
M:4/4
L:1/4
Q:1/4=120
%%score V1 V2 V3 BS
V:V1 name="Voix 1"
V:V2 name="Voix 2"
V:V3 name="Voix 3"
V:BS name="Basse" clef=bass
K:F
V:V1
F G A F | F G A F | A B c2 | A B c2 | c/d/c/B/ A F | c/d/c/B/ A F | F C F2 | F C F2 |]
V:V2
z4 | z4 | F G A F | F G A F | A B c2 | A B c2 | c/d/c/B/ A F | c/d/c/B/ A F |]
V:V3
z4 | z4 | z4 | z4 | F G A F | F G A F | A B c2 | A B c2 |]
V:BS
F,4 | F,4 | F,4 | F,4 | F,4 | F,4 | F,2 C,2 | F,4 |]
</textarea>

## Noms des voix

Les noms viennent des lignes `V:` (`name="…"`). Une portée qui contient plusieurs voix sans nom est
listée sous la forme *Nom (1)*, *Nom (2)* :

```abc
%%score (HAUT BAS)
V:HAUT name="Batterie" stem=up
V:BAS stem=down
```

→ *Batterie (1)*, *Batterie (2)*.

## Bon à savoir

* Les voix coupées sont mémorisées **par nom** : dans un recueil où chaque morceau a une voix
  *Clave*, la couper une fois la coupe dans tous les morceaux.
* L'[export MIDI](fr/export.md) omet les voix coupées.
* Changer une voix met la lecture en pause, comme les autres réglages.
* Les portées de tablature ne sont pas des voix : elles ne sont jamais listées.
