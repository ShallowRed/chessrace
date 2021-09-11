import 'styles/global.css';
import 'styles/alpha.css';
import 'styles/alpha.css';

import 'app/utils/animation-polyfill';

import Game from 'app/Game';
import { generateLevelBlueprint } from 'app/utils/level-generator';
import { getRandomPiecesColor } from 'app/utils/get-random-pieces-color';

const levelConfig = {

  columns: 8,
  rows: 20,
  visibleRows: 12,

  playerStart: {
    position: [4, 0],
    pieceName: "queen"
  },

  durations: {
    move: 0.3,
    translation: 2,
    fall: 1
  },

  piecesColors: getRandomPiecesColor(),
}

Game.init(levelConfig, generateLevelBlueprint(levelConfig));
