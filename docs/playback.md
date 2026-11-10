# Playback & cursor

<textarea data-abcjs-fx>
X:1
T:The Irish Washerwoman
R:jig
C:Traditional
M:6/8
L:1/8
Q:3/8=100
K:G
|:dc|BGG DGG|BGB dcB|cAA EAA|cAc edc|
BGG DGG|BGB dcB|cBc Adc|BGG G:|
</textarea>

| Action | Result |
|---|---|
| Click the score (outside a note) | Play / pause |
| Click a note **while playing** | Jump to that note |
| Click a note while stopped | `editor` mode: selects its ABC code · other modes: plays from that note |
| <kbd>Space</kbd> / <kbd>Enter</kbd> on the focused score | Play / pause |
| Audio bar | Restart, loop, progress bar (click to seek), tempo in % |

## Animated cursor

A red line follows the music and the notes being played are highlighted. Turn it off with
`animate="false"`:

```html
<textarea data-abcjs-fx animate="false">…</textarea>
```

## One player at a time

Starting a player pauses the others on the page. Try it with the example on the
[Overview](/) page… or with the two players below.

<textarea data-abcjs-fx mode="audio">
X:1
T:Scale up
M:4/4
L:1/8
K:C
CDEF GABc | c8 |]
</textarea>

<textarea data-abcjs-fx mode="audio">
X:1
T:Scale down
M:4/4
L:1/8
K:C
cBAG FEDC | C8 |]
</textarea>
