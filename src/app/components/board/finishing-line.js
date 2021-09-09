import GameObject from 'app/components/Game-object';

const { round, ceil } = Math;

export function render(endRow) {

  const { size } = GameObject;
  const { frontFace, rightFaces, bottomFaces } = this.canvas
  const colors = this.colors.finishLine;

  const rows = 5;
  const squareSize = round(size / rows);
  const borderWidth = ceil(squareSize) / 5;

  const width = frontFace.width;
  const top = this.squares.getTop([, endRow]);

  frontFace.ctx.fillStyle = colors.light;
  frontFace.draw.rectangle({
    top,
    width,
    height: size,
    color: colors.light
  });

  frontFace.ctx.strokeStyle = colors.dark;
  frontFace.ctx.lineWidth = borderWidth;
  frontFace.ctx.strokeRect(
    borderWidth / 2,
    top + borderWidth / 2,
    width - borderWidth,
    size - borderWidth
  );

  rightFaces.ctx.fillStyle = colors.rightFaces;
  rightFaces.draw.rightFace({
    left: width - size,
    top: top,
    size
  });

  bottomFaces.ctx.fillStyle = colors.bottomFaces;
  bottomFaces.draw.bottomFace({
    top: top,
    size: width
  });

  frontFace.ctx.globalCompositeOperation = "source-atop";
  frontFace.ctx.fillStyle = colors.dark

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < rows * (this.columns + 1); col += 2) {

      frontFace.draw.square({
        left: (col + row % 2) * squareSize,
        top: top - (row + 1) * squareSize + size,
        size: squareSize
      });
    }
  }

  frontFace.ctx.globalCompositeOperation = "source-over";
}
