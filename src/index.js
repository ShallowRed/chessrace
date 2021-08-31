import 'styles/global.css';
import 'styles/alpha.css';
import 'styles/alpha.css';

import 'app/utils/animation-polyfill';

import Game from 'app/Game';
import { generateLevelBlueprint } from 'app/utils/level-generator';

Game.init(generateLevelBlueprint({ columns: 8, rows: 30}));
