import GameObject from 'app/components/Game-object';

const { round, ceil } = Math;

export function render(endRow) {

  const { depth, size } = GameObject;

  const rows = 5;
  const squareSize = round(size / rows);
  const borderWidth = ceil(squareSize) / 5;

  const width = this.canvas.face.width;
  const top = this.squares.getTop(endRow) - size;

  this.ctx.face.fillStyle = this.colors.finishLine.light;
  this.draw.rectangle(this.ctx.face, {
    top,
    width,
    height: size
  });

  this.ctx.face.strokeStyle = this.colors.finishLine.dark;
  this.ctx.face.lineWidth = borderWidth;
  this.ctx.face.strokeRect(
     borderWidth / 2,
     top + borderWidth / 2,
     width - borderWidth,
     size - borderWidth
  );

  this.ctx.bottom.fillStyle = this.colors.finishLine.bottom;
  this.draw.bottomFace(this.ctx.bottom, {
    top: top + size - depth,
    size: width
  });

  this.ctx.right.fillStyle = this.colors.finishLine.right;
  this.draw.rightFace(this.ctx.right, {
    left: width,
    top: top - depth,
    size
  });

  this.canvas.face.ctx.globalCompositeOperation = "source-atop";
  this.ctx.face.fillStyle = this.colors.finishLine.dark

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < rows * (this.columns + 1); col += 2) {

      this.draw.square(this.canvas.face.ctx, {
        left: (col + row % 2) * squareSize,
        top: top - (row+1) * squareSize + size,
        size: squareSize
      });
    }
  }

  this.canvas.face.ctx.globalCompositeOperation = "source-over";
}
