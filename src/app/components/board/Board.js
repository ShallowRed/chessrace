import boardColors from 'app/components/board/board-colors';

import * as BoardParts from 'app/components/Board/board-parts';
import * as BoardSquares from 'app/components/Board/board-squares';
import * as FinishLine from 'app/components/Board/finishing-line';

import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Board {

  nRenders = 0;

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, {
      parts: BoardParts,
      squares: BoardSquares,
      finishLine: FinishLine,
    });

    this.parts.create();
  }

  setDimensions() {

    const dimensions = this.parts.getDimensions(this.columns, this.rows);

    this.parts.setDimensions(dimensions);
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
