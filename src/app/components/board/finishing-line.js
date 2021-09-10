import GameObject from 'app/components/Game-object';
import boardColors from 'app/components/board/board-colors';

const { round, ceil } = Math;

export function render(endRow) {

  const { size, offset, depth } = GameObject;
  const { frontFace, rightFaces, bottomFaces, shadows } = this.ctx
  const colors = boardColors.finishLine;

  const width = frontFace.canvas.width;
  const top = this.squares.getTop([, endRow]);
  const borderWidth = ceil(size) / 20;


  shadows.draw.rectangle({
    top: top + depth + offset.shadow,
    width,
    height: size
  });

  frontFace.fillStyle = colors.light;
  frontFace.strokeStyle = colors.dark;
  frontFace.lineWidth = borderWidth;
  frontFace.draw.rectangle({ top, width, height: size });
  frontFace.draw.innerStrokeRectangle({ top, width, height: size });

  rightFaces.fillStyle = colors.rightFaces;
  rightFaces.draw.rightFace({ left: width - size, top: top });

  bottomFaces.fillStyle = colors.bottomFaces;
  bottomFaces.draw.bottomFace({ top: top, size: width });

  frontFace.globalCompositeOperation = "source-atop";
  frontFace.fillStyle = colors.dark
  this.finishLine.renderSquares(top, size, frontFace);
  frontFace.globalCompositeOperation = "source-over";
}

export function renderSquares(top, size, ctx) {

  const rows = 5;
  const squareSize = round(size / rows);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < rows * (this.columns + 1); col += 2) {
      ctx.draw.square({
        left: (col + row % 2) * squareSize,
        top: top - (row + 1) * squareSize + size,
        size: squareSize
      });
    }
  }
}
