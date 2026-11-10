# abcjs-fx

[🇬🇧 English version](README.md) · [📖 Documentation et exemples en direct](https://fxpar.github.io/abcjs-fx/#/fr/)

**Un lecteur et éditeur de musique ABC prêt à l'emploi, basé sur [abcjs](https://www.abcjs.net/).**
Écrivez un morceau en notation ABC dans un `<textarea>` ; abcjs-fx le transforme en partition avec
lecteur audio, menu de recueil et outils de travail. Aucune compilation, aucune dépendance autre qu'abcjs.

```html
<script src="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/dist/abcjs-basic-min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/abcjs@6.7.2/abcjs-audio.css">
<script src="https://cdn.jsdelivr.net/gh/fxpar/abcjs-fx@v9.0.0/src/abcjs-fx.js"></script>

<textarea data-abcjs-fx>
X:1
T:Au clair de la lune
M:4/4
L:1/4
K:C
"C"C C C D | "G7"E2 D2 | "C"C E "G7"D D | "C"C4 |]
</textarea>
```

## Fonctionnalités

* **Partition + audio** — synthétiseur, curseur animé, clic sur la partition pour lancer / suspendre,
  clic sur une note pour y sauter.
* **Recueils** — plusieurs morceaux `X:` avec menu précédent / suivant, en-tête commun, collage d'un
  recueil entier.
* **Outils de travail** — transposition (partition, son et noms d'accords), swing, accords coupés,
  métronome, décompte d'une mesure (joué une seule fois en boucle).
* **Voix** — couper ou écouter seule chaque voix d'une partition à plusieurs voix.
* **Tablature** — numéros de case sur fond blanc, lisibles partout.
* **Export** — MIDI (ce que vous entendez), ABC du morceau, recueil complet avec vos modifications.
* **Éditeur en direct** — la partition suit la frappe ; les avertissements d'abcjs sont listés.
* **Modes d'affichage** — `editor`, `audio`, `midi` (lecteur seul), `paper` (partition seule).
* **Interface en français / anglais** — langue du navigateur détectée, menu de langue dans le lecteur
  (mémorisé), infobulles de la barre audio d'abcjs traduites ; extensible à d'autres langues.
* **Diagrammes d'accords (extension)** — diagrammes dessinés à la place des noms d'accords, qui
  suivent la transposition ; forme modifiable accord par accord ; formes calculées pour les accords
  absents de la bibliothèque.

## Fichiers

| Fichier | Rôle |
|---|---|
| [`src/abcjs-fx.js`](src/abcjs-fx.js) | le lecteur (CSS inclus) |
| [`src/abcjs-fx-diagrams.js`](src/abcjs-fx-diagrams.js) | extension facultative des diagrammes d'accords |
| [`src/chord-library.js`](src/chord-library.js) | formes d'accords ukulélé et guitare utilisées par l'extension (~115 Ko) |
| [`docs/`](docs/) | site de documentation ([Docsify](https://docsify.js.org)), publié avec GitHub Pages |
| [`examples/`](examples/) | une page autonome pour essayer les sources en local |

Nécessite **abcjs 6.4 ou plus récent** (testé avec 6.7.2).

## Documentation

**https://fxpar.github.io/abcjs-fx/#/fr/** — une page par fonctionnalité, chacune avec un exemple en
direct, en français et en anglais.

Pour la consulter en local, servez le dossier `docs/` avec n'importe quel serveur statique, par exemple :

```bash
npx docsify-cli serve docs
```

ou `python -m http.server --directory docs`, puis ouvrez http://localhost:8000.

## Développement

Les sources sont de simples scripts navigateur : il n'y a rien à compiler. Après une modification de
`src/`, recopiez les fichiers utilisés par la documentation :

```bash
npm run sync-docs
```

`npm run check` vérifie la syntaxe des sources.

## WordPress

Le [plugin ABC Notation](https://github.com/fxpar/abcjs-wp-plugin) (version 7) utilise abcjs-fx.

## Licence

[MIT](LICENSE). abcjs est © Paul Rosen et contributeurs, licence MIT.
