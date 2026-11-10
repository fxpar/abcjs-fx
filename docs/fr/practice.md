# Outils de travail

Ouvrez <code>⋮</code> sous le lecteur. Chaque réglage s'applique aussitôt (la lecture se met en pause ;
relancez-la).

<textarea data-abcjs-fx chord-diag="true">
X:1
T:When the Saints Go Marching In
C:Traditionnel
M:4/4
L:1/4
Q:1/4=120
K:C
z C E F | "C"G4 | z C E F | G4 | z C E F | G2 E2 | C2 E2 | "G7"D4 |
z E E D | "C"C3 C | E2 G2 | "C7"G "F"F3 | z E F G | "C"E2 C2 | "G7"D2 D2 | "C"C4 |]
</textarea>

## Transposition

De −12 à +12 demi-tons. La **partition**, le **son** et les **noms d'accords** sont transposés ensemble
(la liste d'accords affichée avec `chord-diag="true"` suit aussi).

## Swing

| Réglage | Valeur abcjs | Effet |
|---|---|---|
| Aucun | 50 | croches égales |
| Léger | 58 | |
| Ternaire | 66 | 2:1, jazz / shuffle |
| Prononcé | 75 | croche pointée + double |

?> Le swing fonctionne dans les mesures en X/4 et X/8. Une valeur de départ peut être donnée avec
`options='{"swing": 66}'`.

## Couper les accords

Joue la mélodie sans l'accompagnement généré à partir des accords.

## Métronome

Un clic à chaque temps, accentué sur le premier. Le motif est calculé à partir de la mesure `M:`
(le 6/8 est compté en deux temps à la noire pointée).

## Décompte

Une mesure de clics avant le début de la musique. Le curseur attend la fin du décompte et, en mode
**boucle**, le décompte n'est joué qu'au premier tour.

## Réglages et recueils

Transposition, swing, accords coupés, métronome et décompte sont conservés quand on passe à un autre
morceau du recueil. **Réinitialiser** (<code>⋮</code>) rétablit les valeurs par défaut et le texte
d'origine du morceau courant.
