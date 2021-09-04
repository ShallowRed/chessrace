import GameObject from 'app/components/Game-object';

const { floor, round} = Math;

export function render(ctx, endRow) {

  const { size, shadowShift, leftOffset} = GameObject;

  const targetWidth = this.canvas.main.width - shadowShift * 2;

  const bandSquares = this.finishingLine.squares.get(targetWidth);
  const boardLimit = this.squares.getTop(endRow) - round(size / 15);

  const width = bandSquares.size * bandSquares.cols;
  const shift = round((targetWidth - width)/ 2);

  const height = bandSquares.size * bandSquares.rows;
  const left = leftOffset + shift;
  const top = boardLimit - size  + round((size - height) / 2);

  ctx.fillStyle = this.arrivalColors.light;
  ctx.fillRect(left, top, width, height);

  ctx.globalCompositeOperation = "source-atop";
  this.finishingLine.squares.render(ctx, bandSquares, top, shift);
  ctx.globalCompositeOperation = "source-over";

  ctx.fillStyle = this.arrivalColors.bottom;
  this.draw.bottomFace(ctx, {
    left,
    top: top + height,
    size: width
  });

  ctx.fillStyle = this.arrivalColors.right;
  this.draw.rightFace(ctx, {
    left: width + left,
    top,
    size: height
  });

}

export const squares = {

  get(width) {
    let cols = 50;
    const size = floor(width / cols);

    cols = floor(width / size);
    const rows = floor(GameObject.size / size);

    return { rows, cols, size };
  },

  render(ctx, bandSquares, boardLimit, shift) {

    ctx.fillStyle = this.arrivalColors.dark;

    for (let row = 0; row < bandSquares.rows; row++) {
      for (let col = 0; col < bandSquares.cols; col += 2) {

        this.draw.square(ctx, {
          left: shift * 2 + (2 + col + row % 2) * bandSquares.size,
          top: boardLimit + row * bandSquares.size,
          size: bandSquares.size
        });
      }
    }
  }
}
