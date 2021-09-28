import LevelSquare from 'app/level/level-square';

import FilterMap from 'app/utils/filter-and-map-array';
import { parseBlueprint } from 'app/utils/parse-blueprint';
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class LevelModel {

  pieces = ['bishop', 'king', 'knight', 'pawn', 'queen', 'rook'];

  constructor(levelBlueprint, columns, rows, visibleRows) {

    Object.assign(this, { columns, rows, visibleRows });

    this.blueprint = parseBlueprint(levelBlueprint, columns);

    bindObjectsMethods.call(this, { square: LevelSquare });

    this.init();
  }

  init() {

    this.values = this.blueprint.map(rows => [...rows]);

    this.deepRegularSquares = [];

    this.lastRowRendered = -1;

    this.rowToRenderUpTo = this.visibleRows + 1;
  }

  parseNextRows() {

    this.newEnnemyPieces = [];

    let rowIndex = this.lastRowRendered + 1;

    const isVisible = rowIndex =>
      rowIndex <= this.rowToRenderUpTo && rowIndex < this.rows;

    for (rowIndex; isVisible(rowIndex); rowIndex++) {

      const { regularSquares, newEnnemies } = this.parseRow(rowIndex);

      this.deepRegularSquares.push(regularSquares);

      this.newEnnemyPieces.push(...newEnnemies);

      this.lastRowRendered = rowIndex;
    }

    this.rowToRenderUpTo = this.lastRowRendered + 1;

    if (this.lastRowRendered > this.visibleRows + 1) {

      this.deepRegularSquares.shift();
    }

    this.regularSquares = this.deepRegularSquares.flat();
  }

  parseRow(rowIndex) {

    // FilterMap creates an array with the array passed as argument,
    // which will preserve each element initial index once filtered

    const filterableRow = new FilterMap(this.values[rowIndex]);

    const isNotHole = value => value > 0;

    const isEnnemy = value => value > 1;

    const getSquareCoords = (value, index) => [index, rowIndex];

    const getPiecePositionAndName = (value, index) => ({
      pieceName: this.pieces[value - 2],
      position: [index, rowIndex]
    });

    return {

      regularSquares: filterableRow
        .filter(isNotHole)
        .map(getSquareCoords), // map with element's index before filter

      newEnnemies: filterableRow
        .filter(isEnnemy)
        .map(getPiecePositionAndName) // map with element's index before filter
    }
  }
}
