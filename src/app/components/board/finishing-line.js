import GameObject from 'app/components/Game-object';

const { round, ceil } = Math;

export function render(endRow) {

  const { depth, size } = GameObject;

  const rows = 5;
  const squareSize = round(size / rows);
  const borderWidth = ceil(squareSize) / 5;

  const width = this.canvas.frontFace.width;
  const top = this.squares.getTop([,endRow]);

  const colors = this.colors.finishLine;

  this.ctx.frontFace.fillStyle = colors.light;
  this.canvas.frontFace.draw.rectangle({
    top,
    width,
    height: size,
    color: colors.light
  });

  this.ctx.frontFace.strokeStyle = colors.dark;
  this.ctx.frontFace.lineWidth = borderWidth;
  this.ctx.frontFace.strokeRect(
     borderWidth / 2,
     top + borderWidth / 2,
     width - borderWidth,
     size - borderWidth
  );

  this.ctx.bottomFaces.fillStyle = colors.bottomFaces;
  this.canvas.bottomFaces.draw.bottomFace({
    top: top + size - depth,
    size: width
  });

  this.ctx.rightFaces.fillStyle = colors.rightFaces;
  this.canvas.rightFaces.draw.rightFace({
    left: width,
    top: top - depth,
    size
  });

  this.canvas.frontFace.ctx.globalCompositeOperation = "source-atop";
  this.ctx.frontFace.fillStyle = colors.dark

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < rows * (this.columns + 1); col += 2) {

      this.canvas.frontFace.draw.square({
        left: (col + row % 2) * squareSize,
        top: top - (row+1) * squareSize + size,
        size: squareSize
      });
    }
  }

  this.canvas.frontFace.ctx.globalCompositeOperation = "source-over";
}
