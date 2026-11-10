# Changer de forme (extension)

La plupart des accords ont plusieurs formes. On peut les changer **pour un seul accord**, directement
dans la partition, sans rien de visible tant qu'on n'en a pas besoin.

<textarea data-abcjs-fx chord-diagrams="ukulele">
X:1
T:Do mineur harmonique – accords de 4 sons
M:4/4
L:1/4
K:C
"Cm(maj7)"[C_EGB]2 "Dm7b5"[DF_Ac]2 | "Ebmaj7(#5)"[_EGBd]2 "Fm7"[F_Ac_e]2 |
"G7"[GBdf]2 "Abmaj7"[_Ac_eg]2 | "Bdim7"[Bdf_a]2 "Cm(maj7)"[C_EGB]2 |]
</textarea>

| Action | Résultat |
|---|---|
| **Survoler** un diagramme | les languettes `‹ ›` et le numéro de forme apparaissent |
| Clic sur `‹` ou `›` | forme précédente / suivante **pour cet accord seulement** |
| **Double-clic** sur un diagramme | appliquer sa forme à **tous les accords du même nom** |
| <kbd>Tab</kbd> jusqu'au diagramme, puis <kbd>←</kbd> <kbd>→</kbd> | changer de forme au clavier |
| <kbd>Entrée</kbd> | appliquer à tous les accords du même nom |
| <kbd>Échap</kbd> | quitter le diagramme |
| Écran tactile | le premier appui affiche les languettes, les suivants changent la forme |

* Un accord dont la forme diffère de la forme par défaut garde son numéro affiché, **en bleu** : on voit
  d'un coup d'œil ce qui a été personnalisé.
* Le panneau <code>⋮</code> liste les **formes par défaut** : en changer une s'applique à tous les accords de
  ce nom qui n'ont pas été personnalisés (`+1` compte les personnalisés).
* Les choix survivent à la **transposition** : ils sont mémorisés par degré, pas par nom d'accord.
* Cliquer sur un diagramme ne lance pas la lecture et ne sélectionne pas de code ABC.

!> Les accords personnalisés sont repérés par leur rang dans le morceau : ajouter ou supprimer un accord
dans le code décale les personnalisations qui suivent.
