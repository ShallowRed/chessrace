import { squareKey } from 'app/level/threat';

import type LevelModel from 'app/level/model';
import type { Coords } from 'app/types';

export default {

  isInBoard(this: LevelModel, [col, row]: Coords): boolean {

    return col >= 0 &&
      row >= 0 &&
      col < this.columns &&
      row <= this.rows
  },

  get(this: LevelModel, [col, row]: Coords): number | undefined {

    return this.blueprint[row]?.[col];
  },

  isHole(this: LevelModel, squareCoords: Coords): boolean {

    return this.square.get(squareCoords) === 0;
  },

  isEnemy(this: LevelModel, squareCoords: Coords): boolean {

    return (this.square.get(squareCoords) ?? 0) > 1;
  },

  isHeld(this: LevelModel, squareCoords: Coords): boolean {

    return this.heldSquares.has(squareKey(squareCoords));
  },

  isObstacle(this: LevelModel, squareCoords: Coords): boolean {

    return this.square.isHole(squareCoords) ||
      this.square.isEnemy(squareCoords)
  }
}
