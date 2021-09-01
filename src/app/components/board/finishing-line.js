import GameObject from 'app/components/Game-object';
const { floor, round, ceil } = Math;

export function render(endRow) {

  const { squareSize, shadowShift } = GameObject;

  const bandSquares = this.finishingLine.squares.get();
  const boardLimit = this.squares.getTop(endRow) - 5;

  const width = this.canvas.width - shadowShift;
  const height = bandSquares.size * bandSquares.rows;
  const left = 0;
  const top = boardLimit - squareSize - 2 + (squareSize -height) / 2;

  this.ctx.fillRect(left, top, width, height);
  this.ctx.fillStyle = this.arrivalColors.light;
  this.ctx.fillRect(left, top, width, height);

  this.ctx.globalCompositeOperation = "source-atop";
  this.finishingLine.squares.render(bandSquares, top);
  this.ctx.globalCompositeOperation = "source-over";

  this.ctx.fillStyle = this.arrivalColors.bottom;
  this.draw.bottomFace({
    left,
    top: top + height,
    size: width
  });

  this.ctx.fillStyle = this.arrivalColors.right;
  this.draw.rightFace({
    left: this.canvas.width - shadowShift,
    top,
    size: height
  });

}

export const squares = {

  get() {
    const width = this.canvas.width - GameObject.shadowShift;
    let cols = 50;
    const size = ceil(width / cols);

    cols = ceil(width / size);
    const rows = floor(GameObject.squareSize / size);

    return { rows, cols, size };
  },

  render(bandSquares, boardLimit) {

    this.ctx.fillStyle = this.arrivalColors.dark;

    for (let row = 0; row < bandSquares.rows; row++) {
      for (let col = 0; col < bandSquares.cols; col += 2) {

        this.draw.square({
          left: (col + row % 2) * bandSquares.size,
          top: boardLimit + row * bandSquares.size,
          size: bandSquares.size
        });
      }
    }
  }
}
