import boardColors from 'app/components/board/board-config-colors';
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

    this.squares.renderSquaresOfColor(sameColorSquares, color)
  }
}

export function renderSquaresOfColor(squares, color) {

  for (const canvas of this.coloredCanvas) {

    const coloredSquaresInCanvas =
      canvas.filter?.bind(this)(squares) || squares;

    canvas.ctx.fillStyle = boardColors.squares[color][canvas.name];

    this.squares.renderSquaresSet(coloredSquaresInCanvas, canvas)
  }
}
