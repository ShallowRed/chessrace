# Chessrace — analyse de valeur et analyse technique

> Analyse réalisée le 28/07/2026 sur `73fc7be` (dernier commit, 24/05/2023).
> Le jeu a été rebuildé et rejoué dans un navigateur pour produire ce document ;
> les captures ci-dessous sont issues du code de ce commit, pas d'archives.

---

## 1. Résumé en dix lignes

Chessrace est un jeu d'arcade dans un navigateur : un échiquier défile vers le bas,
on y monte case par case en se déplaçant selon les règles d'une pièce d'échecs,
les trous tuent, et **manger une pièce ennemie transforme le joueur en cette pièce**.
1 286 lignes de JS vanilla, zéro dépendance à l'exécution, 6,9 ko gzip.
Le rendu pseudo-3D est fait à la main sur 7 canvas superposés, un par « face »
de l'extrusion, et le défilement est délégué au compositeur CSS — il n'y a
aucune boucle de rendu par frame dans ce jeu.

**Le concept et le rendu valent bien plus que ce que le dépôt en laisse voir.**
Le code est propre pour du travail d'autodidacte de 2021 ; ce qui coûte cher
aujourd'hui, ce n'est pas la qualité du code, c'est l'emballage : pas de README,
pas de démo en ligne, 48 commits nommés « misc », et un build qui ne passe plus
sur une machine Linux/CI moderne pour trois raisons triviales à corriger.

---

## 2. Ce que fait le projet

| | |
|---|---|
| ![Départ](docs/screenshot-start.png) | ![En cours de partie](docs/screenshot-ingame.png) |
| Au lancement : le joueur (dame) en bas, les ennemis répartis sur le plateau. | En partie : le plateau a défilé, de nouvelles rangées trouées arrivent par le haut. |

Boucle de jeu observée :

1. Le joueur démarre en bas de l'échiquier, avec une pièce (dame par défaut).
2. Le premier clic sur une case atteignable lance la partie (`GAME_ON`).
3. Le plateau se met à défiler d'une case toutes les 2 s, indéfiniment.
4. Un clic sur une case valide déplace le joueur selon les règles de la pièce
   courante ; un clic sur une pièce ennemie la mange **et le joueur devient
   cette pièce**.
5. Se déplacer sur un trou (ou traverser un trou en pièce à longue portée) fait
   tomber le joueur → `GAME_OVER`. Sortir par le bas de l'écran → `GAME_OVER`.
6. Atteindre la ligne d'arrivée (rangée 17, avec un damier noir et blanc dessiné
   en `globalCompositeOperation: source-atop`) → `GAME_WON`.

C'est un *endless runner* dont le vocabulaire de déplacement est celui des
échecs. La mécanique de transformation par capture est la vraie trouvaille :
elle transforme chaque prise en un choix tactique (« est-ce que je veux devenir
un cavalier maintenant ? ») au lieu d'un simple gain de points.

---

## 3. Analyse de valeur

### 3.1 Le concept — c'est là qu'est la valeur

Le croisement « échecs × endless runner » est simple à expliquer en une phrase,
jouable au doigt sur mobile, et n'a pas besoin d'IA d'échecs ni de règles
complètes (pas de roque, pas d'échec au roi, pas de tour par tour). Le design
évite tous les pièges coûteux d'un jeu d'échecs tout en gardant ce qui est
lisible immédiatement par n'importe qui : la façon dont bouge un cavalier.

La transformation par capture est le mécanisme qui donne de la profondeur pour
zéro complexité de code (7 lignes dans `update-pieces.js`). C'est le genre
d'idée qu'on ne retrouve pas facilement.

Ce qui manque au concept pour être un jeu et pas une démo : un score, une
progression de difficulté, et une raison de rejouer. Rien de tout ça n'est
structurel — voir §7.

### 3.2 La réalisation visuelle

Le rendu est le deuxième actif du dépôt, et il est sous-estimé. Chaque case est
un bloc extrudé dessiné en trois polygones (face avant, face droite, face
inférieure) plus une ombre portée décalée, avec une palette de trois nuances par
couleur de case. Les trous ne sont pas dessinés : ce sont des cases absentes, et
ce sont les faces latérales des cases voisines qui créent l'illusion de la
profondeur (`isSquare.leftToHole`, `isSquare.belowHole`). C'est élégant, et
c'est ce qui donne au plateau son aspect « bloc de bois découpé ».

Le bandeau du haut (`render-input.js`, 72 lignes de dessin manuel) simule une
fente par laquelle le plateau semble sortir. C'est purement décoratif, ça n'a
aucune fonction de jeu, et c'est exactement le genre de détail qui fait qu'un
projet a l'air fini.

Les 12 pièces sont des SVG inlinés en base64 dans le CSS : le jeu entier tient
en deux fichiers et fonctionne hors-ligne, sans une seule requête réseau après
le chargement.

### 3.3 Valeur « portfolio » — le vrai problème

Le dépôt est public, 0 étoile, 0 fork, **pas de description GitHub, pas de
topics, pas de homepage, pas de README, pas de licence, pas de démo déployée,
pas une seule capture d'écran**. Un visiteur qui atterrit dessus voit un dossier
`src/` et 50 commits dont 48 s'appellent « misc ». Il ne peut pas savoir que
c'est un jeu, ni le voir tourner, ni le lancer (le build échoue, §5).

Autrement dit : **le travail est fait, la valeur est là, et elle est
intégralement invisible.** C'est le déséquilibre le plus rentable à corriger —
quelques heures de travail pour la totalité du gain de perception.

Une note honnête sur l'usage portfolio : c'est du code de 2021, écrit en
apprenant. Ce n'est pas un handicap si c'est présenté comme tel. « Voici un jeu
que j'ai écrit en vanilla JS quand j'apprenais, voici ce que j'en pense
aujourd'hui, voici ce que je referais autrement » est un bien meilleur signal
qu'un projet récent et lisse. Ce document peut servir de base à ce récit.

---

## 4. Analyse technique

### 4.1 Chiffres

| Métrique | Valeur |
|---|---|
| Fichiers source JS | 39 |
| Lignes de JS | 1 286 |
| Lignes de CSS | 160 (dont 46 de SVG base64) |
| Dépendances à l'exécution | **0** (aucun polyfill core-js n'est réellement injecté) |
| Bundle produit | 21 ko JS (6,9 ko gzip) + 17,3 ko CSS (7,9 ko gzip) |
| Couches canvas | 7 |
| Tests | 0 |
| CI | aucune |
| Historique | 50 commits, 05/09/2021 → 24/05/2023, dont 48 nommés « misc » |
| ESLint sur `eslint:recommended` | **0 erreur, 0 warning** |

### 4.2 Architecture

```
index.js
 └── Game ......................... orchestrateur, porte l'état (this.on, durations)
      ├── LevelModel .............. le plateau comme données (grille de chiffres)
      │    └── LevelSquare ........ prédicats: isHole / isEnnemy / isInBoard
      ├── Board ................... le plateau comme pixels
      │    ├── PlayArea ........... singleton de géométrie (tout dérive de squareSize)
      │    ├── CanvasCollection ... 7 Canvas + sous-collections (dynamic/movable/colored)
      │    └── render/ ............ squares, finishLine, input
      ├── Player / EnnemiesCollection ... les pièces, en DOM
      └── game-events/ ............ les règles, sous forme de fonctions exportées
```

La séparation **modèle / rendu** est nette et c'est le point fort de
l'architecture : `LevelModel` ne connaît que des chiffres et des coordonnées,
`Board` ne connaît que des pixels, et personne ne mélange les deux. `PlayArea`
centralise toute la géométrie sous forme de ratios de `squareSize`, ce qui rend
le jeu responsive gratuitement (vérifié : redimensionner la fenêtre à l'arrêt
recalcule proprement tout le plateau).

### 4.3 Les trois idées qui méritent d'être racontées

**1. Le rendu multi-canvas + défilement délégué au compositeur.**
Sept canvas superposés en z-index, un par type de face. Chaque canvas a sa
propre couleur de remplissage et sa propre géométrie ; dessiner une case
« colorée » c'est appeler le même jeu de coordonnées sur chaque couche avec un
`fillStyle` différent (`renderSquaresOfColor`). Conséquence : le défilement ne
redessine rien. Il applique un `transform: translateY(...)` avec une
`transition-duration` sur les conteneurs, et le compositeur GPU s'occupe des
2 secondes d'animation. Le canvas n'est redessiné qu'une fois par rangée
franchie. C'est pour ça qu'il n'y a aucun `requestAnimationFrame` de rendu dans
ce jeu — ce qui, pour un jeu qui défile en permanence, est un choix
d'architecture, pas un oubli.

**2. Le niveau comme chaîne de caractères.**
Un niveau est une chaîne de chiffres (`0` = trou, `1` = case vide, `2..7` =
case + pièce), découpée en rangées par `parse-blueprint.js` avec une regex
`.{1,columns}`. Un niveau 8×17 tient dans 136 caractères. C'est partageable
dans une URL, éditable à la main, diffable dans git, et sérialisable pour un
éditeur de niveaux. Le générateur aléatoire produit simplement une de ces
chaînes — les niveaux « faits main » et « générés » sont donc le même objet.

**3. Le câblage automatique des événements.**
`bind-methods.js` parcourt récursivement un namespace de modules et lie chaque
fonction exportée à l'instance de `Game`. Résultat : écrire
`export function CANVAS_CLICKED(evt) { ... this.player ... }` dans
`game-events/validate-moves.js` **suffit** à créer un écouteur d'événement
nommé `CANVAS_CLICKED` qui a accès à `this === game`. Zéro enregistrement
manuel. Et `events.ask("IS_VALID_TRAJECTORY", cible)` renvoie vrai seulement si
tous les écouteurs renvoient vrai, ce qui permet d'écrire les règles comme une
chaîne de gardes lisible :

```js
if (
     isValidMove(this.player, targetSquare)
  && this.model.square.isInBoard(targetSquare)
  && events.ask("IS_ALLOWED_MOVING")
  && events.ask("IS_VALID_TRAJECTORY", targetSquare)
) events.emit("MOVE_PLAYER", targetSquare);
```

C'est inventif. C'est aussi le point le plus discutable du projet (voir juste
en dessous) — mais c'est de l'invention, pas de la copie de tutoriel.

### 4.4 Ce qui a vieilli, et ce qui était déjà discutable

**La magie de `bind-methods` a un coût.** Le lien entre le nom d'un événement et
la fonction qui le traite n'existe nulle part dans le code : il est produit à
l'exécution. Conséquence concrète : « Aller à la définition » ne marche pas,
un renommage de fonction casse silencieusement un événement, et un
`grep MOVE_PLAYER` ne montre que des chaînes de caractères. Sur 1 300 lignes ça
passe ; sur 5 000 ça devient impraticable. Un `Map` explicite
`{ MOVE_PLAYER: movePlayer }` coûterait dix lignes et rendrait tout traçable.

**Le graphe de dépendances est circulaire.** `Game` → `game-events` → `events`
→ retour vers `Game` via `this`. Tout passe par le bus, donc rien n'est
testable isolément sans instancier le jeu complet. C'est le principal obstacle à
l'ajout de tests aujourd'hui — sauf pour la logique pure (§7.2).

**`setStyle` devine son unité.** `if (element[key]) { element[key] = value } else { element.style[key] = value + "px" }` :
une propriété DOM existante est écrite telle quelle, sinon on suppose des
pixels. Ça marche par chance (`canvas.width` vaut 300 par défaut, donc
*truthy*), mais une valeur à `0` bascule dans l'autre branche. C'est le genre de
raccourci qui explose six mois plus tard.

**L'anglais approximatif est dans l'API publique.** `ennemy` / `ennemies`
(français) au lieu de `enemy` / `enemies`, partout : noms de classes, de
fichiers, de classes CSS, d'événements. À renommer avant toute mise en avant du
dépôt.

**`arrayIncludesArray` est en O(n) par appel.** Les coordonnées sont
*jointes* en chaîne puis cherchées avec `Array.includes`, ce qui fait un
balayage complet pour chaque case testée. Avec ~104 cases visibles c'est
invisible ; un `Set` de clés le rendrait O(1) pour deux lignes de diff.

**La chaîne d'outillage est morte.** Webpack 4-ish (`ejs-loader`,
`html-webpack-plugin` v4), Babel + `core-js` pour cibler des navigateurs qui
n'existent plus, un `animation-polyfill.js` pour `requestAnimationFrame` — API
universellement supportée depuis 2013. Aujourd'hui, Vite sans Babel produirait
le même bundle avec un `vite.config.js` de dix lignes, et
`webpack.commons.js` + `webpack.config.js` (200 lignes de configuration
« générique » pour un seul projet) disparaîtraient.

**Le dernier commit a abîmé la lisibilité.** `73fc7be` — « remove every
whitespace (why ??) » — est passé sur les 38 fichiers source et a supprimé
toutes les lignes vides et tous les commentaires de structure. Le style d'avant
était très aéré (une ligne vide entre chaque instruction) ; il est devenu un
bloc compact en indentation 4. Le point d'interrogation du message de commit
suggère que ce n'était pas voulu. C'est réversible en une commande
(`git revert 73fc7be`), et c'est probablement à faire avant de rendre le dépôt
présentable.

---

## 5. État de santé : le build ne passe plus

`npm install && npm run prod` échoue aujourd'hui sur une machine Linux avec
Node 22. Trois causes indépendantes, toutes triviales :

**1. `cross-env` n'est pas déclaré.** Les quatre scripts npm l'utilisent
(`cross-env NODE_ENV=dev ...`) mais il n'apparaît ni dans `dependencies` ni dans
`devDependencies`. Sur une installation propre : `sh: 1: cross-env: not found`.
Le paquet devait être installé globalement sur la machine d'origine.

**2. Une casse de fichier incorrecte.** `src/index.js` fait
`import Game from 'app/game'` alors que le fichier s'appelle `src/app/Game.js`.
Ça fonctionne sur macOS et Windows (systèmes de fichiers insensibles à la
casse) et **échoue sur Linux et donc sur toute CI**.

**3. Webpack 5.52 + Node ≥ 17.** Webpack hachait avec MD4 via OpenSSL ; MD4 a
été retiré dans OpenSSL 3, ce qui donne
`Error: error:0308010C digital envelope routines::unsupported`. Corrigé en
amont dans webpack 5.54.

Une fois ces trois points levés, **le build passe et le jeu fonctionne
parfaitement** : 21 ko de bundle, aucune erreur console, boucle de jeu,
défilement, capture-transformation, chute, victoire — tout marche. Le projet
n'est pas mort, il est juste inaccessible.

Deux détails d'hygiène au passage : `"npm": "^8.1.0"` figure dans les
`dependencies` (~60 Mo installés par accident, sans usage), et
`package-lock.json` est à la fois **committé** et listé dans `.gitignore`, ce
qui est contradictoire.

---

## 6. Bugs vérifiés dans le jeu

Trouvés par lecture puis **reproduits** dans un navigateur :

**Le verrou anti-double-coup ne fonctionne pas.** `Player.setFlag(flag, duration)`
fait `setTimeout(..., duration)` alors que `duration` est **en secondes** partout
ailleurs dans le projet. `this.durations.move` vaut `0.3` → le drapeau
`isMoving` est relevé au bout de 0,3 **milliseconde** au lieu de 300 ms. Le garde
`IS_ALLOWED_MOVING` ne bloque donc jamais rien. Mesuré : trois déplacements
enchaînés en 120 ms alors que l'animation de déplacement dure 300 ms — la pièce
glisse encore vers une case qu'elle a déjà quittée. Même problème pour
`isFalling` (1 s → 1 ms). Correctif : `duration * 1000`.
Notons que l'auteur avait la bonne conversion ailleurs, écrite
`this.durations.move * 800` (= 80 % de 300 ms) dans `update-pieces.js` — d'où
une conversion s→ms qui existe sous deux formes incompatibles dans le même
dossier.

**`isPlayer` renvoie l'inverse de son nom.** Dans `update-pieces.js` :
`function isPlayer(piece) { return !piece.isPlayer; }`, utilisé comme
`offBoardPieces.filter(isPlayer)`. Le comportement final est correct (on ne veut
retirer que les ennemis), mais le nom dit le contraire de ce que fait la
fonction. C'est un piège pour la prochaine personne qui touche à ce fichier.

**Redimensionner pendant le défilement décale le plateau** pendant un cycle.
Les `translateY` sont en pixels calculés avec l'ancienne `squareSize` et ne sont
pas recalculés ; l'affichage se resynchronise au pas de défilement suivant
(≤ 2 s). Redimensionner à l'arrêt, en revanche, est parfaitement propre.

**`alert()` pour la fin de partie.** `GAME_OVER` et `GAME_WON` bloquent le fil
d'exécution avec un `alert()` natif, après avoir déjà réinitialisé le plateau —
donc on voit le plateau neuf *derrière* la boîte de dialogue qui annonce la
défaite. Il n'y a ni écran de fin, ni bouton rejouer, ni score.

**Les niveaux générés ne sont pas garantis franchissables.** `level-generator.js`
force la colonne 3 à être toujours praticable, ce qui garantit un chemin — mais
c'est un contournement, pas une validation. Il reste dans le fichier deux
générateurs alternatifs en commentaire. Aucune notion de difficulté croissante.

---

## 7. Pistes de poursuite

Trois scénarios, du moins coûteux au plus ambitieux. Ils sont cumulatifs :
chacun suppose le précédent.

### 7.1 Scénario A — « Rendre visible » (une demi-journée)

Le meilleur rapport valeur/effort, et de loin. Rien à réécrire.

- Corriger les trois causes du build (§5) : ajouter `cross-env`,
  renommer l'import en `app/Game`, passer webpack à `^5.54`.
- Retirer `npm` des dépendances, décider du sort de `package-lock.json`.
- `git revert 73fc7be` pour retrouver le code lisible.
- Écrire un **README** : une phrase de pitch, un GIF de 5 secondes, les règles,
  comment lancer, et une section « ce que j'en pense cinq ans après » qui pointe
  vers ce document. C'est cette dernière section qui fait la différence entre un
  vieux repo et une pièce de portfolio.
- Ajouter une **licence** (le `package.json` dit ISC, mais il n'y a pas de
  fichier `LICENSE`).
- **Déployer** sur GitHub Pages ou Netlify — la sortie est trois fichiers
  statiques, ça prend dix minutes — et mettre l'URL dans le champ « Website » du
  dépôt.
- Renseigner la description et les topics GitHub (`game`, `chess`, `canvas`,
  `vanilla-js`, `webpack`). Actuellement tous vides.

### 7.2 Scénario B — « Rendre solide » (deux à trois jours)

- **Tester la logique pure d'abord.** C'est la bonne nouvelle du projet : le
  domaine est déjà séparé du DOM. `pieces-movements.js`,
  `get-squares-on-trajectory.js`, `parse-blueprint.js`,
  `array-includes-array.js`, `level-square.js` et `level.js` sont des fonctions
  pures qui se testent avec Vitest sans navigateur ni *mock*. Une centaine de
  lignes de tests couvre les règles de déplacement des six pièces — le cœur du
  jeu — pour un effort quasi nul.
- **Corriger les bugs du §6**, en commençant par `setFlag` (une ligne).
- **Remplacer webpack par Vite** : suppression de `webpack.config.js`,
  `webpack.commons.js`, `babel.config.json`, de `core-js`, et de
  `animation-polyfill.js`. Le projet est déjà en modules ES natifs avec des
  alias — la migration est mécanique. Un serveur de dev avec rechargement à
  chaud change aussi complètement l'expérience de développement (aujourd'hui :
  `webpack --watch` + `live-server` dans deux terminaux).
- **Rendre le bus d'événements explicite** : remplacer `getBoundMethods` par une
  table `{ MOVE_PLAYER: movePlayer, ... }`. On perd la magie, on gagne la
  navigation dans le code, l'autocomplétion et le refactoring sûr.
- **Renommer `ennemy` → `enemy`** partout (un `sed`, un commit dédié).
- Ajouter une **CI GitHub Actions** minimale : `install`, `lint`, `test`,
  `build`. C'est ce qui aurait attrapé le bug de casse du §5 en 2021.

### 7.3 Scénario C — « En faire un jeu » (l'ambitieux)

Par ordre décroissant de rapport plaisir/effort :

1. **Score et progression.** Compter les rangées franchies, accélérer le
   défilement au fil du temps (`durations.scroll` est déjà une variable, il
   suffit de la faire décroître). Meilleur score en `localStorage`. C'est
   quelques dizaines de lignes et ça transforme la démo en jeu.
2. **Écran de fin et bouton rejouer** à la place des `alert()`. `Game.reset()`
   existe déjà et fonctionne — il ne manque que l'interface.
3. **Sons et retour haptique.** Un clic à chaque déplacement, un son de capture,
   un son de chute. Sur un jeu à un doigt, c'est ce qui donne le plus de
   sensation pour le moins de code.
4. **Choix de la pièce de départ**, avec des difficultés implicites : le cavalier
   est un mode difficile *gratuit*, le pion un mode presque impossible. Tout le
   moteur le permet déjà (`playerSpawn.pieceName` dans la configuration).
5. **Niveaux faits main et partage.** Un niveau est déjà une chaîne de 136
   caractères : la mettre dans l'URL (`?level=0011...`) donne le partage de
   niveau gratuitement, et un petit éditeur (une grille cliquable qui écrit la
   chaîne) est un après-midi de travail.
6. **Validation de franchissabilité** du générateur : un parcours en largeur
   depuis la ligne de départ avec les mouvements de la pièce courante, pour
   garantir qu'un niveau généré est jouable, et pour mesurer sa difficulté
   (nombre de coups du chemin optimal) — ce qui permet ensuite une vraie courbe
   de difficulté.
7. **Clavier et accessibilité.** Le plateau est un canvas : il est
   intégralement invisible pour un lecteur d'écran, et il n'y a aucune commande
   au clavier. Un déplacement aux flèches et un état textuel `aria-live`
   seraient un exercice intéressant, et un argument rare dans un portfolio.
8. **PWA.** Le jeu ne fait aucune requête réseau après le chargement et pèse
   15 ko gzip : un `manifest.json` et un *service worker* le rendent installable
   et jouable hors-ligne pour presque rien.

### 7.4 Ce que je *ne* recommande pas

- **Réécrire en React / TypeScript pour le principe.** Le jeu manipule des
  pixels sur des canvas et des `transform` CSS ; React n'apporterait rien à ces
  1 300 lignes et enlèverait ce qui rend le projet intéressant à lire — le fait
  qu'il soit en vanilla. TypeScript se justifierait, mais après les tests, pas
  avant.
- **Ajouter une IA d'échecs ou des règles complètes.** Le design tient
  précisément parce qu'il *n'est pas* un jeu d'échecs. Ajouter l'échec au roi ou
  des ennemis qui jouent en casserait l'équilibre autant que le code.
- **Repartir de zéro.** Le noyau (modèle, géométrie, rendu) est sain et
  fonctionne. Tout ce qui manque s'ajoute par-dessus.

---

## 8. Par où commencer, concrètement

| Ordre | Tâche | Effort | Effet |
|---|---|---|---|
| 1 | Réparer le build (3 correctifs, §5) | 30 min | Le projet redevient exécutable par quelqu'un d'autre |
| 2 | `git revert 73fc7be` | 2 min | Le code redevient lisible |
| 3 | Déployer sur Pages/Netlify + lien dans le dépôt | 30 min | Le projet devient jouable en un clic |
| 4 | README avec GIF + licence + topics | 2 h | Le projet devient compréhensible |
| 5 | Corriger `setFlag` (secondes → ms) | 5 min | Le jeu se comporte comme prévu |
| 6 | Tests Vitest sur la logique pure | 3 h | Le projet devient modifiable sans peur |
| 7 | Migration Vite | 3 h | Le projet redevient agréable à développer |
| 8 | Score + accélération + écran de fin | 1 j | Le projet devient un jeu |

Les quatre premières lignes tiennent dans une demi-journée et représentent
l'essentiel du gain.

---

## Annexe — méthode de vérification

Tout ce qui est affirmé ici a été vérifié sur la machine, pas déduit :

- `npm install` puis build webpack, échecs reproduits et diagnostiqués un par un.
- Build réussi après correctifs → `dist/` servi en HTTP local.
- Jeu ouvert dans Chromium (Playwright), viewport 420×820, 2× :
  aucune erreur console au chargement ni en jeu.
- Coups joués par script pour vérifier les règles de déplacement, le
  défilement, et le comportement du verrou `isMoving` (§6).
- Redimensionnement testé à l'arrêt et pendant le défilement.
- ESLint exécuté avec la configuration du dépôt : aucune remontée.
- Métriques de bundle mesurées sur la sortie réelle, brute et gzip.
