import GameObject from 'app/components/Game-object';
import { getSquaresOnTrajectory, filterMap } from 'app/utils/utils';

export default class LevelModel {

  pieces = ["bishop", "king", "knight", "pawn", "queen", "rook"];

  constructor(blueprint, visibleRows) {
    this.visibleRows = visibleRows;
    this.rows = blueprint.rows;
    this.blueprint = this.parseBlueprint(blueprint);
    this.reset();
  }

  reset() {

    this.values = this.blueprint.map(rows => [...rows]);
    this.regularSquares = [];

    this.lastRowRendered = 0
    this.lastRowToRender = this.visibleRows;
  }

  parseBlueprint({ levelString, columns }) {

    const columnsRegExp = `.{1,${columns}}`;

    return levelString
      .match(new RegExp(columnsRegExp, 'g'))
      .map(rowString =>
        rowString.split("")
        .map(numberString => parseInt(numberString))
      )
  }

  parse() {

    const newEnnemyPieces = [];

    for (let i = this.lastRowRendered; i < this.lastRowToRender && i < this
      .rows; i++) {

      const parsedRow = this.parseRow(i);

      this.regularSquares.push(parsedRow.regularSquares);
      newEnnemyPieces.push(...parsedRow.pieces);

      this.lastRowRendered = i + 1;
    }

    this.lastRowToRender = this.lastRowRendered + 1;

    if (GameObject.skippedRows) {

      this.regularSquares.splice(0, 1);
    }

    return {
      regularSquares: this.regularSquares.flat(),
      newEnnemyPieces
    };
  }

  parseRow(rowIndex) {

    const row = this.values[rowIndex];

    const isNotHole = ({ value }) => value > 0;
    const isPiece = ({ value }) => value > 1;

    const getSquareCoord = ({ index }) => [index, rowIndex];

    const getPiecePositionAndName = ({ index }) => ({
      pieceName: this.pieces[row[index] - 2],
      position: [index, rowIndex - GameObject.skippedRows]
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
    return this.values[y + GameObject.skippedRows]?.[x];
  }

  set([x, y], value) {
    this.values[y + GameObject.skippedRows][x] = value;
  }

  removeEnnemy(squareCoords) {
    this.set(squareCoords, 1)
  }

  isHole(squareCoord) {
    return this.get(squareCoord) === 0;
  }

  isEnnemy(squareCoord) {
    return this.get(squareCoord) > 1;
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
