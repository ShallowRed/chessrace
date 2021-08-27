import GameObject from 'app/components/Game-object';
import { columns, boardRows, visibleRows, } from "app/config";
import { getSquaresOnTrajectory, filterMap } from 'app/utils/utils';

export default class BoardModel {

  constructor(blueprint) {
    this.blueprint = blueprint;
  }

  reset() {
    this.values = this.blueprint.map(row => ([...row]));

    this.skippedRows = 0;
    GameObject.skippedRows = 0;
    this.lastRowRendered = 0
    this.lastRowToRender = visibleRows;

    this.regularSquares = [];
  }

  incrementSkippedRows() {
    GameObject.skippedRows++;
    this.skippedRows++;
  }

  parse() {

    const newEnnemyPieces = [];

    for (let i = this.lastRowRendered; i < this.lastRowToRender; i++) {

      const parsedRow = this.parseRow(i);

      this.regularSquares.push(parsedRow.regularSquares);
      newEnnemyPieces.push(...parsedRow.pieces);

      this.lastRowRendered = i + 1;
    }

    this.lastRowToRender = this.lastRowRendered + 1;

    if (this.skippedRows) {

      this.regularSquares.splice(0,1);
    }

    return {
      regularSquares: this.regularSquares.flat(),
      newEnnemyPieces
    };
  }

  parseRow(rowIndex) {

    const row = this.values[rowIndex];

    const isNotHole = ({ value }) => !!value;
    const getSquareCoord = ({ index }) => [index, rowIndex];

    const isPiece = ({ value }) => typeof value === "string";
    const getPiecePositionAndName = ({ index }) => ({
      pieceName: row[index],
      position: [index, rowIndex - this.skippedRows]
    });

    return {
      regularSquares: filterMap(row, {
        filter: isNotHole,
        map: getSquareCoord
      }),
      pieces: filterMap(row, {
        filter: isPiece,
        map: getPiecePositionAndName
      })
    }
  }

  get([x, y]) {
    return this.values[y + this.skippedRows]?.[x];
  }

  set([x, y], value) {
    this.values[y + this.skippedRows][x] = value;
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
      position: firstObstacle,
      isHole: this.isHole(firstObstacle)
    }
  }
}
