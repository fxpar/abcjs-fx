# Voices: mute & solo

When a tune has at least two voices, a **Voices** accordion appears at the bottom of the <code>⋮</code>
panel:

* a checkbox per voice to **mute** it,
* a **Solo** button to hear one voice alone (click again to hear them all),
* **Unmute all**.

<textarea data-abcjs-fx>
X:1
T:Frère Jacques (round)
C:Traditional
M:4/4
L:1/4
Q:1/4=120
%%score V1 V2 V3 BS
V:V1 name="Voice 1"
V:V2 name="Voice 2"
V:V3 name="Voice 3"
V:BS name="Bass" clef=bass
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

## Voice names

The names come from `V:` lines (`name="…"`). A staff holding several voices without names is
listed as *Name (1)*, *Name (2)*:

```abc
%%score (TOP BOTTOM)
V:TOP name="Drums" stem=up
V:BOTTOM stem=down
```

→ *Drums (1)*, *Drums (2)*.

## Good to know

* Muted voices are remembered **by name**: in a tunebook where every tune has a *Clave* voice, muting
  it once mutes it in every tune.
* The [MIDI export](export.md) leaves the muted voices out.
* Changing a voice pauses the playback, like the other settings.
* Tablature staves are not voices: they are never listed.
