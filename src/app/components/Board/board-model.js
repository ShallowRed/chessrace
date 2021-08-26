import { columns, boardRows, visibleRows, nRenders } from "app/config";
import { getSquaresOnTrajectory } from 'app/utils/utils';

export default class BoardModel {

  constructor(blueprint) {
    this.blueprint = blueprint;
  }

  reset() {
    this.values = this.blueprint.map(row => ([...row]));
  }

  parse() {

    const regularSquares = [];
    const newEnnemyPieces = [];

    this.forEachValue(({ value, coords, isPiece }) => {

      const squareOffset = this.getSquareOffset(coords);

      if (squareOffset > 1 || squareOffset < -(visibleRows + 2)) return;

      if (value) {

        regularSquares.push(coords);
      }

      if (isPiece) {

        if (!nRenders) {

          newEnnemyPieces.push({ value, coords });

        } else if (squareOffset === 1) {

          ++coords[1];
          newEnnemyPieces.push({ value, coords });
        }
      }
    });

    return { regularSquares, newEnnemyPieces };
  }

  forEachValue(callback) {

    for (let i = 0; i < boardRows; i++) {
      for (let j = 0; j < columns; j++) {

        const value = this.values[i][j];

        callback({
          value,
          coords: [j, i - nRenders],
          isPiece: typeof value == "string"
        });
      }
    }
  }

  getSquareOffset(coords) {
    return coords[1] - visibleRows;
  }

  get([x, y]) {
    return this.values[y + nRenders - 1]?.[x];
  }

  set([x, y], value) {
    this.values[y + nRenders - 1][x] = value;
  }

  removeEnnemy(squareCoords) {
    this.set(squareCoords, 1)
  }

  isHole(squareCoord) {
    return this.get(squareCoord) === 0;
  }

  isEnnemy(squareCoord) {
    return typeof this.get(squareCoord) === "string";
  }

  getFirstObstacleOnTrajectory(currentPosition, targetSquare) {

    const isObstacle = square =>
      this.isHole(square) || this.isEnnemy(square)

    const firstObstacle =
      getSquaresOnTrajectory(currentPosition, targetSquare)
      .find(isObstacle);

    if (firstObstacle) return {
      coords: firstObstacle,
      isHole: this.isHole(firstObstacle)
    }
  }
}
