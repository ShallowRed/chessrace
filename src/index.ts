import 'styles/global.css';
import 'styles/alpha.css';
// import 'styles/neo.css';

import Game from 'app/Game';

import { levelConfig } from 'app/level/default-level-config';
import { levelBySlug } from 'app/level/levels';

const requested = new URLSearchParams(window.location.search).get("level");

const game = new Game(levelConfig(levelBySlug(requested)));

game.init();
