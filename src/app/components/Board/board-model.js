import { columns, boardRows, visibleRows } from "app/config";

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

      if (this.squareOffset(coords) > 1) return;

      if (value) {

        regularSquares.push(coords);
      }

      if (isPiece) {

        if (!this.nRenders) {

          newEnnemyPieces.push({ value, coords });

        } else if (this.squareOffset(coords) === 1) {

          ++coords[1];
          newEnnemyPieces.push({ value, coords });
        }
      }
    });
    // Todo remove ennemies who disapearred 
    return { regularSquares, newEnnemyPieces };
  }

  squareOffset(coords) {
    return coords[1] - visibleRows;
  }

  forEachValue(callback) {

    for (let i = 0; i < boardRows; i++) {
      for (let j = 0; j < columns; j++) {

        const value = this.values[i][j];

        callback({
          value,
          coords: [j, i - this.nRenders],
          isPiece: typeof value == "string"
        });
      }
    }
  }

  get([x,y]) {
    return this.values[y + this.nRenders - 1]?.[x];
  }

  set([x,y], value) {
    this.values[y + this.nRenders - 1][x] = value;
  }

  removeEnnemy(squareCoords) {
    this.set(squareCoords, 1)
  }
}
