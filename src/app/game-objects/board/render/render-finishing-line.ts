import PlayArea from 'app/game-objects/board/models/play-area';

import type Canvas from 'app/game-objects/board/models/canvas';
import type Board from 'app/game-objects/board/board';

const { round } = Math;

interface FinishLine {
  top: number;
  width: number;
  height: number;
}

export function render(this: Board, row: number): void {

  const finishLine: FinishLine = {
    top: this.getSquare.top(row),
    width: this.columns * PlayArea.squareSize,
    height: PlayArea.squareSize
  }

  for (const canvas of this.canvas.movableCollection) {

    canvas.ctx.fillStyle = this.colors.finishLine[canvas.shape.type];

    canvas.draw(canvas.getShape(finishLine));
  }

  this.finishLine.renderFrontFace(finishLine, this.canvas.frontFaces);
}

export function renderFrontFace(this: Board, finishLine: FinishLine, canvas: Canvas): void {

  canvas.ctx.fillStyle = this.colors.finishLine.squares;

  canvas.ctx.globalCompositeOperation = "source-atop";

  this.finishLine.renderSquares(finishLine, canvas);

  canvas.ctx.globalCompositeOperation = "source-over";
}

export function renderSquares(
  this: Board,
  { top, height }: FinishLine,
  canvas: Canvas
): void {

  const rows = 5;

  const squareSize = round(height / rows);

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < rows * (this.columns + 1); col += 2) {

      canvas.draw(canvas.getShape({
        left: (col + row % 2) * squareSize,
        top: top - (row + 1) * squareSize + height,
        width: squareSize,
        height: squareSize
      }));
    }
  }
}
