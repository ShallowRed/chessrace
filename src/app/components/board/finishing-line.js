import GameObject from 'app/components/Game-object';
const { floor, ceil } = Math;

export function render(ctx, endRow) {

  const { size, shadowShift } = GameObject;

  const bandSquares = this.finishingLine.squares.get();
  const boardLimit = this.squares.getTop(endRow) - 5;

  const width = this.canvas.main.width - shadowShift;
  const height = bandSquares.size * bandSquares.rows;
  const left = 0;
  const top = boardLimit - size - 2 + (size -height) / 2;

  ctx.fillRect(left, top, width, height);
  ctx.fillStyle = this.arrivalColors.light;
  ctx.fillRect(left, top, width, height);

  ctx.globalCompositeOperation = "source-atop";
  this.finishingLine.squares.render(ctx, bandSquares, top);
  ctx.globalCompositeOperation = "source-over";

  ctx.fillStyle = this.arrivalColors.bottom;
  this.draw.bottomFace(ctx, {
    left,
    top: top + height,
    size: width
  });

  ctx.fillStyle = this.arrivalColors.right;
  this.draw.rightFace(ctx, {
    left: width,
    top,
    size: height
  });

}

export const squares = {

  get() {
    const width = this.canvas.main.width - GameObject.shadowShift;
    let cols = 50;
    const size = ceil(width / cols);

    cols = ceil(width / size);
    const rows = floor(GameObject.size / size);

    return { rows, cols, size };
  },

  render(ctx, bandSquares, boardLimit) {

    ctx.fillStyle = this.arrivalColors.dark;

    for (let row = 0; row < bandSquares.rows; row++) {
      for (let col = 0; col < bandSquares.cols; col += 2) {

        this.draw.square(ctx, {
          left: (col + row % 2) * bandSquares.size,
          top: boardLimit + row * bandSquares.size,
          size: bandSquares.size
        });
      }
    }
  }
}
