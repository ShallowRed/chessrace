import GameObject from 'app/components/Game-object';
import boardColors from 'app/components/board/board-config-colors';

const { round } = Math;

export function render(row) {

  const finishLine = {
    top: this.square.get.top(row),
    width: this.columns * GameObject.size,
    height: GameObject.size
  }

  for (const canvas of this.dynamicCanvas) {
    canvas.ctx.fillStyle = boardColors.finishLine[canvas.name];
    canvas.draw(canvas.getShape(finishLine));
  }

  const canvas = this.canvas.frontFaces;

  canvas.ctx.globalCompositeOperation = "source-atop";
  canvas.ctx.fillStyle = boardColors.finishLine.squares
  this.finishLine.renderSquares(finishLine, canvas);
  canvas.ctx.globalCompositeOperation = "source-over";
}

export function renderSquares({ top, height }, canvas) {

  const rows = 5;
  const squareSize = round(height / rows);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < rows * (this.columns + 1); col += 2) {

      canvas.draw({
        left: (col + row % 2) * squareSize,
        top: top - (row + 1) * squareSize + height,
        width: squareSize,
        height: squareSize
      });
    }
  }
}
