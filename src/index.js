import 'styles/global.css';
import 'styles/alpha.css';
// import 'styles/neo.css';

import 'app/utils/animation-polyfill';

import Game from 'app/game';

import levelConfig from 'app/level/default-level-config';

Game.init(levelConfig);
