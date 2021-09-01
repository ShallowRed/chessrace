import { getSquaresOnTrajectory, filterMap } from 'app/utils/utils';

export default class LevelModel {

  skippedRows = 0;
  pieces = ["bishop", "king", "knight", "pawn", "queen", "rook"];

  constructor(blueprint, visibleRows) {
    this.visibleRows = visibleRows;
    this.rows = blueprint.rows;
    this.blueprint = this.parseBlueprint(blueprint);
    this.reset();
  }

  reset() {
    this.skippedRows = 0;
    this.firstParse = true;
    this.values = this.blueprint.map(rows => [...rows]);
    this.deepRegularSquares = [];
    this.lastRowRendered = 0;
    this.lastRowToRender = this.visibleRows + 1;
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

    this.newEnnemyPieces = [];

    const isVisibleRow = row =>
      row < this.lastRowToRender &&
      row < this.rows;

    for (let row = this.lastRowRendered; isVisibleRow(row); row++) {

      const parsedRow = this.parseRow(row);

      this.deepRegularSquares.push(parsedRow.regularSquares);
      this.newEnnemyPieces.push(...parsedRow.pieces);

      this.lastRowRendered = row + 1;
    }

    this.lastRowToRender = this.lastRowRendered + 2;

    if (this.skippedRows) {
      this.deepRegularSquares.splice(0, 1);
    }

    this.regularSquares = this.deepRegularSquares.flat();
  }

  parseRow(rowIndex) {

    const row = this.values[rowIndex];

    const isNotHole = ({ value }) => value > 0;
    const isPiece = ({ value }) => value > 1;

    const getSquareCoord = ({ index }) => [index, rowIndex];

    const getPiecePositionAndName = ({ index }) => ({
      pieceName: this.pieces[row[index] - 2],
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

  get([col, row]) {
    return this.values[row + this.skippedRows]?.[col];
  }

  set([col, row], value) {
    this.values[row + this.skippedRows][col] = value;
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
