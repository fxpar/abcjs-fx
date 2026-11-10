# API JavaScript et événements

Tout est exposé sur `window.AbcjsFx` (aussi disponible sous son ancien nom `window.AbcPlayer9`).

## Initialisation

```js
// Les lecteurs sont créés automatiquement au chargement de la page.
// Pour du contenu ajouté ensuite (Ajax, applications monopages) :
AbcjsFx.init(document.querySelector("#nouveau-contenu")); // renvoie les nouveaux lecteurs

// Sans balisage :
var lecteur = AbcjsFx.create({
  container: document.getElementById("ici"), // ou before: unElement
  abc: "X:1\nT:Bonjour\nK:C\nCDEF GABc|]",
  mode: "audio",          // editor | audio | midi | paper
  options: { staffwidth: 500 },
  synthOptions: { program: 24 },
  animate: true,
  lang: "fr"
});
```

Un élément n'est jamais initialisé deux fois (`data-abcp-ready` est posé dessus).

## Fonctions globales

| | |
|---|---|
| `AbcjsFx.version` | `"9.1.1"` |
| `AbcjsFx.players` | tous les lecteurs créés |
| `AbcjsFx.pauseAll(sauf)` | met en pause tous les lecteurs sauf `sauf` |
| `AbcjsFx.splitTunebook(texte)` | `{header, prefix, tunes:[{abc, title}]}` |
| `AbcjsFx.transposeChord("F#m7/C#", 2)` | `"G#m7/D#"` |
| `AbcjsFx.i18n` | textes de l'interface, par langue |
| `AbcjsFx.setLanguage(code, {remember})` | change la langue de tous les lecteurs (mémorisée par défaut) |
| `AbcjsFx.forgetLanguage()` | oublie le choix du lecteur |
| `AbcjsFx.defaultLang` | langue par défaut du site, prioritaire sur celle du navigateur (à définir avant la création des lecteurs) |
| `AbcjsFx.resolveLang(element)` | la langue qu'aurait un nouveau lecteur |

## Un lecteur

| | |
|---|---|
| `lecteur.togglePlay()` / `lecteur.pause()` | lecture |
| `lecteur.isPlaying()` | `true` pendant la lecture |
| `lecteur.loadTune(index)` | afficher un autre morceau du recueil |
| `lecteur.tunes`, `lecteur.current` | le recueil et l'indice du morceau affiché |
| `lecteur.state` | `{transpose, swing, chordsOff, metronome, countIn, muted}` |
| `lecteur.voiceList()` | noms des voix, dans l'ordre d'abcjs |
| `lecteur.lang`, `lecteur.setLanguage(code)` | langue de l'interface de ce lecteur seulement |
| `lecteur.editor` | l'`ABCJS.Editor` sous-jacent |
| `lecteur.root`, `lecteur.paperEl`, `lecteur.textarea` | éléments du DOM |

## Événement

Après chaque dessin, l'élément racine du lecteur émet `abcjs-fx:render` (l'événement remonte) :

```js
document.addEventListener("abcjs-fx:render", function (e) {
  var d = e.detail;   // { player, tune (objet visuel abcjs), chords: ["C", "G7", …] }
  console.log(d.player.tunes[d.player.current].title, d.chords);
});
```

## Afficher vos propres grilles d'accords

Avec `chord-diag="true"`, la liste des accords est dessinée par `AbcjsFx.chordDiagramRenderer`
s'il est défini :

```js
AbcjsFx.chordDiagramRenderer = function (element, accords, lecteur) {
  element.innerHTML = accords.map(function (c) { return "<b>" + c + "</b>"; }).join(" · ");
};
```

## Extensions

`abcjs-fx-diagrams.js` repose sur ce mécanisme ; vous pouvez écrire les vôtres :

```js
AbcjsFx.plugins.push({
  configure: function (lecteur, cfg) {   // avant le premier dessin
    // cfg.attr("mon-attribut") lit un attribut de l'élément d'origine
    lecteur.options.staffwidth = 600;
  },
  afterRender: function (lecteur) {      // après chaque dessin
    // lecteur.paperEl contient le SVG
  }
});
```

Enregistrez l'extension **avant** la création des lecteurs (chargez-la juste après `abcjs-fx.js`).

## Outils d'accords (extension)

```js
AbcjsFx.diagrams.parseChord("Bbm7b5");      // {root, suffix, pcs, bass, …}
AbcjsFx.diagrams.shapesFor("guitar", "C/E"); // [{abs:[0,3,2,0,1,0], source:"generated"}, …]
AbcjsFx.diagrams.instruments;                // accordages
```
