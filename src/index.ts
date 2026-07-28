import 'styles/global.css';
import 'styles/alpha.css';
// import 'styles/neo.css';

import Game from 'app/Game';

import levelConfig from 'app/level/default-level-config';

const game = new Game(levelConfig);

game.init();
