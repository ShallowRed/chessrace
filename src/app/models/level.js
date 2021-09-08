import { getSortedPiecesNames } from 'app/models/pieces';
import { filterMap } from 'app/utils/filter-and-map-array';
import { parseBlueprint } from 'app/utils/parse-blueprint';
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Level {

  skippedRows = 0;
  pieces = getSortedPiecesNames();

  methodsToBind = {
    row: LevelRow,
    square: LevelSquare
  }

  constructor(levelBlueprint, columns, rows, visibleRows) {

    Object.assign(this, { columns, rows, visibleRows });

    this.blueprint = parseBlueprint(levelBlueprint, this.columns);

    bindObjectsMethods.call(this, this.methodsToBind);

    this.reset();
  }

  reset() {
    this.skippedRows = 0;
    this.firstParse = true;
    this.values = this.blueprint.map(rows => [...rows]);
    this.deepRegularSquares = [];
    this.lastRowRendered = -1;
    this.lastRowToRender = this.visibleRows + 1;
  }

  parse(nRenders) {

    this.newEnnemyPieces = [];

    for (let rowIndex = this.lastRowRendered + 1; this.row.isVisible(
      rowIndex); rowIndex++) {

      const parsedRow = this.row.parse(this.values[rowIndex], rowIndex);
      
      this.deepRegularSquares.push(parsedRow.regularSquares);
      this.newEnnemyPieces.push(...parsedRow.pieces);

      this.lastRowRendered = rowIndex;
    }

    this.lastRowToRender = this.lastRowRendered + 1;

    if (nRenders) {
      this.deepRegularSquares.splice(0, 1);
    }

    this.regularSquares = this.deepRegularSquares.flat();
  }
}

const LevelRow = {

  isVisible(rowIndex) {

    return rowIndex <= this.lastRowToRender &&
      rowIndex < this.rows;
  },

  parse(row, rowIndex) {

    return {

      regularSquares: filterMap(row, {
        filter: this.row.isNotHole,
        map: this.row.getSquareCoord(rowIndex)
      }),

      pieces: filterMap(row, {
        filter: this.row.isPiece,
        map: this.row.getPiecePositionAndName(row, rowIndex)
      })
    }
  },

  isNotHole({ value }) {
    return value > 0;
  },

  isPiece({ value }) {
    return value > 1;
  },

  getSquareCoord(rowIndex) {
    return ({ index }) => [index, rowIndex];
  },

  getPiecePositionAndName(row, rowIndex) {
    return ({ index }) => ({
      pieceName: this.row.getPieceName(row, index),
      position: [index, rowIndex - this.skippedRows]
    });
  },

  getPieceName(row, index) {
    return this.pieces[row[index] - 2];
  }
}

const LevelSquare = {

  get([col, row]) {
    return this.values[row + this.skippedRows]?.[col];
  },

  set([col, row], value) {
    this.values[row + this.skippedRows][col] = value;
  },

  removeEnnemy(squareCoords) {
    this.square.set(squareCoords, 1)
  },

  isHole(squareCoord) {
    return this.square.get(squareCoord) === 0;
  },

  isEnnemy(squareCoord) {
    return this.square.get(squareCoord) > 1;
  },

  isObstacle(square) {
    return this.square.isHole(square) || this.square.isEnnemy(square)
  }
}
