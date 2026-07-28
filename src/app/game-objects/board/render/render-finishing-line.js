import PlayArea from 'app/game-objects/board/models/play-area';

const { round } = Math;

export function render(row) {

  const finishLine = {
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

export function renderFrontFace(finishLine, canvas) {

  canvas.ctx.fillStyle = this.colors.finishLine.squares;

  canvas.ctx.globalCompositeOperation = "source-atop";

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
