import LevelRow from 'app/level/level-row';
import LevelSquare from 'app/level/level-square';

import { parseBlueprint } from 'app/utils/parse-blueprint';
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class LevelModel {

  pieces = ['bishop', 'king', 'knight', 'pawn', 'queen', 'rook'];

  constructor(levelBlueprint, columns, rows, visibleRows) {

    Object.assign(this, { columns, rows, visibleRows });

    this.blueprint = parseBlueprint(levelBlueprint, columns);

    bindObjectsMethods.call(this, { row: LevelRow, square: LevelSquare });

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

      const { regularSquares, newEnnemies } = this.row.parse(rowIndex);

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
}
