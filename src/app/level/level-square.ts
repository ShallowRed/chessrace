import type LevelModel from 'app/level/level';
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

  isObstacle(this: LevelModel, squareCoords: Coords): boolean {

    return this.square.isHole(squareCoords) ||
      this.square.isEnemy(squareCoords)
  }
}
