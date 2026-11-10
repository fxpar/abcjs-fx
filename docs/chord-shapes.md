# Changing shapes (extension)

Most chords have several shapes. They can be changed **for one chord only**, right in the score, with
nothing visible until you need it.

<textarea data-abcjs-fx chord-diagrams="ukulele">
X:1
T:C harmonic minor – seventh chords
M:4/4
L:1/4
K:C
"Cm(maj7)"[C_EGB]2 "Dm7b5"[DF_Ac]2 | "Ebmaj7(#5)"[_EGBd]2 "Fm7"[F_Ac_e]2 |
"G7"[GBdf]2 "Abmaj7"[_Ac_eg]2 | "Bdim7"[Bdf_a]2 "Cm(maj7)"[C_EGB]2 |]
</textarea>

| Action | Result |
|---|---|
| **Hover** a diagram | the `‹ ›` tabs and the shape number appear |
| Click `‹` or `›` | previous / next shape **for this chord only** |
| **Double-click** a diagram | apply its shape to **every chord with the same name** |
| <kbd>Tab</kbd> to a diagram, then <kbd>←</kbd> <kbd>→</kbd> | change the shape from the keyboard |
| <kbd>Enter</kbd> | apply to every chord with the same name |
| <kbd>Esc</kbd> | leave the diagram |
| Touch screen | the first tap shows the tabs, the next taps change the shape |

* A chord whose shape differs from the default keeps its number visible, **in blue**: you can see at a
  glance what was customized.
* The <code>⋮</code> panel lists the **default shapes**: changing one there applies to every chord of that
  name that has not been customized (`+1` counts the customized ones).
* Choices survive **transposition**: they are stored by degree, not by chord name.
* Clicking a diagram neither plays the music nor selects ABC code.

!> Customized chords are identified by their rank in the tune: adding or removing a chord in the code
shifts the customizations that follow it.
