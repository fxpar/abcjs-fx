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

## Choisir la tablature dans le lecteur

Ouvrez <code>⋮</code> : le champ **Tablature** affiche la tablature prévue par l'auteur (ou *Aucune*) et
permet de choisir un autre instrument, de taper n'importe quel accordage avec **Autre…**, et de régler un
**capo**. Le choix ne concerne que ce lecteur.

<textarea data-abcjs-fx options='{"tablature": [{"instrument": "guitar"}]}'>
X:1
T:Choisissez un instrument dans ⋮
M:4/4
L:1/4
K:G
"G"G A B c | "D7"d2 A2 | "G"B G "C"E c | "G"G4 |]
</textarea>

| Choix | Instrument | Accordage |
|---|---|---|
| `guitar` | guitare | Mi La Ré Sol Si Mi |
| `guitar-dropd` | guitare | Ré La Ré Sol Si Mi |
| `ukulele` | 4 lignes | Sol Do Mi La, Sol aigu — *seulement si `abcjs-reentrant-tab.js` est chargé* |
| `ukulele-lowg` | 4 lignes | Sol grave, Do Mi La |
| `mandolin` | mandoline | Sol Ré La Mi |
| `violin` | violon | Sol Ré La Mi |
| `banjo` | cinq cordes | g D G B d — *seulement avec le patch rentrant* |
| **Autre…** | déduit du nombre de cordes (4, 5 ou 6) | tapé par le lecteur, ex. `D, A, D G B e` |

* `tab-menu="false"` sur un lecteur retire le champ (pour un exercice qui doit rester sur son
  instrument) ; `AbcjsFx.tabMenu = false` le retire sur tout le site.
* `tab-instruments="ukulele,ukulele-lowg,custom"` réduit la liste (`custom` = *Autre…*).
* Pas de champ en modes `midi` et `paper`, ni quand `options` déclare plusieurs portées de tablature.
* **Réinitialiser** rétablit la tablature de l'auteur.

## Autres instruments et accordages

abcjs connaît cinq instruments. **Le nombre de lignes de la tablature vient de l'instrument, pas de
l'accordage** : pour un accordage à 4 cordes (ukulélé, mandoline…), choisissez un instrument à 4 lignes.

| `instrument` | Lignes | Accordage par défaut |
|---|:-:|---|
| `violin`, `fiddle`, `mandolin` | 4 | Sol Ré La Mi |
| `fiveString` (banjo) | 5 | Do Sol Ré La Mi |
| `guitar` | 6 | Mi La Ré Sol Si Mi |

Les autres accordages se donnent de la corde la plus grave à la plus aiguë — ici un ukulélé à Sol grave
(G, C E A) sur un instrument à 4 lignes :

```html
<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "violin", "label": "Ukulélé (Sol grave)", "tuning": ["G,", "C", "E", "A"]}]}'>…</textarea>
```

<textarea data-abcjs-fx mode="audio" options='{"tablature": [{"instrument": "violin", "label": "Ukulélé (Sol grave)", "tuning": ["G,", "C", "E", "A"]}]}'>
X:1
T:Gamme de Do au ukulélé
M:4/4
L:1/4
K:C
C D E F | G A B c |]
</textarea>

## Accordages rentrants (ukulélé à Sol aigu, banjo…)

Seul, abcjs exige des cordes en ordre croissant et refuse un ukulélé à Sol aigu
(*« C string lower than G string »*). Le patch facultatif **`abcjs-reentrant-tab.js`** lève cette limite :
chargez-le juste après abcjs, puis donnez l'accordage dans l'ordre réel des cordes.

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.3.0/src/abcjs-reentrant-tab.js"></script>
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.3.0/src/abcjs-fx.js"></script>

<textarea data-abcjs-fx
  options='{"tablature": [{"instrument": "violin", "label": "Ukulélé (%T)", "tuning": ["G", "C", "E", "A"]}]}'>…</textarea>
```

<textarea data-abcjs-fx options='{"tablature": [{"instrument": "violin", "label": "Ukulélé (%T)", "tuning": ["G", "C", "E", "A"]}]}'>
X:1
T:Ukulélé à Sol aigu
M:4/4
L:1/4
K:C
C D E F | G A B c | "C"[CEGc]2 "Am"[CEAA]2 | "F"[CFAA]2 "G7"[DFGB]2 | "C"[CEGc]4 |]
</textarea>

* Les notes sont placées sur la case la plus basse possible ; dans les accords, une note par corde,
  avec l'écart le plus faible — l'accord de Do ci-dessus donne le doigté habituel `0 0 0 3`.
* Le patch ne modifie pas abcjs : il se greffe sur son module de tablature au chargement de la page. Il
  fonctionne aussi **sans abcjs-fx**, avec `ABCJS.renderAbc`. Si une future version d'abcjs change son
  fonctionnement interne, le patch se désactive (avertissement dans la console) et abcjs se comporte
  comme avant.
* Sans le patch, une solution de repli est l'accordage à Sol grave (`["G,", "C", "E", "A"]`), comme
  dans l'exemple précédent.


### Banjo 5 cordes

Sur un banjo 5 cordes, la 5ᵉ corde (le bourdon aigu, écrit en premier dans `g D G B d`) est **courte** :
elle commence à la 5ᵉ case, donc elle se joue à vide (`0`) ou à partir de la case `6`. Avec
`"instrument": "fiveString"` et un accordage dont la première corde est plus aiguë que la deuxième, le
patch le sait ; à case égale, il préfère les cordes entières : les mélodies passent sur la 1ʳᵉ corde et
le bourdon se joue à vide.

<textarea data-abcjs-fx mode="audio" options='{"tablature": [{"instrument": "fiveString", "label": "Banjo (%T)", "tuning": ["g", "D", "G", "B", "d"]}]}'>
X:1
T:Banjo en Sol ouvert : roulement et mélodie
M:4/4
L:1/8
K:G
|G B g d G B g d | A B g d A B g d |
|"G"[GBdg]4 "D7"[^FAcd]4 | g2 ^g2 a2 b2 |]
</textarea>

L'option `stringStartFret` donne explicitement la case de départ de chaque corde (une valeur par corde
de l'accordage), par exemple `"stringStartFret": [5, 0, 0, 0, 0]` ; `[0, 0, 0, 0, 0]` traite toutes les
cordes comme entières.

## Le fond blanc

* Sa couleur se change en CSS : `.abcp-tab-bg { fill: #fffbe6; }`
* Il utilise l'option abcjs `add_classes`, qu'abcjs-fx active automatiquement en présence d'une
  tablature. Indiquez `"add_classes": false` dans `options` pour supprimer les fonds.
