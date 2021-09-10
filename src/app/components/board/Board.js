import boardColors from 'app/components/board/board-colors';

import * as Squares from 'app/components/Board/squares';
import * as FinishLine from 'app/components/Board/finishing-line';
import * as BoardParts from 'app/components/Board/board-parts';

import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Board {

  nRenders = 0;

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, {
      boardParts: BoardParts,
      squares: Squares,
      finishLine: FinishLine,
    });

    this.boardParts.create();
  }

  setDimensions() {

    const dimensions = this.boardParts.getDimensions(this.columns, this.rows);

    this.boardParts.setDimensions(dimensions);
    this.ctx.shadows.fillStyle = boardColors.shadow;
  }

  render({ regularSquares, lastRowRendered, rows }) {

    if (lastRowRendered === rows - 1) {

      this.finishLine.render(rows);
    }

    this.squares.render(regularSquares);

    this.nRenders++;
  }

  clear() {

    for (const name in this.canvas) {

      const canvas = this.canvas[name];

      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
