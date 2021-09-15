import { arrayIncludesArray } from "app/utils/array-includes-array";

export function render(regularSquares) {

  this.squares.includes = arrayIncludesArray(regularSquares);

  this.squares.renderSquaresSet(regularSquares, this.canvas.shadows);

  this.squares.renderColoredSquares(regularSquares);
}

export function renderSquaresSet(squares, canvas) {

  squares.map(this.square.get.coordsInCanvas)
    .map(canvas.getShape)
    .forEach(canvas.draw);
}

export function renderColoredSquares(squares) {

  for (const color of ["light", "dark"]) {

    const sameColorSquares = squares.filter(this.square.is[color]);

    const colors = this.colors.squares[color];

    this.squares.renderSquaresOfColor(sameColorSquares, colors)
  }
}

export function renderSquaresOfColor(squares, colors) {

  for (const canvas of this.canvas.coloredCollection) {

    const coloredSquaresInCanvas =
      canvas.filter?.bind(this)(squares) || squares;

    canvas.ctx.fillStyle = colors[canvas.shape.type];

    this.squares.renderSquaresSet(coloredSquaresInCanvas, canvas)
  }
}
