import 'styles/global.css';
import 'styles/alpha.css';
import 'styles/alpha.css';

import 'app/utils/animation-polyfill';

import Game from 'app/Game';
import { generateLevelBlueprint } from 'app/utils/level-generator';
import { getRandomPiecesColor } from 'app/utils/utils';

const levelConfig = {
  
  columns: 8,
  rows: 16,
  visibleRows: 12,

  startPos: [4, 2],
  startPiece: "queen",

  translationDuration: 1.5,
  spriteSpeed: 0.3,

  piecesColors: getRandomPiecesColor(),
}

Game.init(levelConfig, generateLevelBlueprint(levelConfig));
