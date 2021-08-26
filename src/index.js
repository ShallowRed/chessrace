import 'styles/global.css';
import 'styles/alpha.css';
import 'styles/alpha.css';

import 'app/utils/animation-polyfill';

import Game from 'app/Game';
import { generateMapBlueprint } from 'app/utils/map-generator';

const blueprint = generateMapBlueprint();

Game.init(blueprint);
Game.reset();
Game.render();
