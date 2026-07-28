import { arrayIncludesArray } from "app/utils/array-includes-array";

import type Canvas from 'app/game-objects/board/models/canvas';
import type Board from 'app/game-objects/board/board';
import type { SquareColor } from 'app/game-objects/board/board-config';
import type { Coords, FaceType } from 'app/types';

export function render(this: Board, regularSquares: Coords[]): void {

  this.squares.includes = arrayIncludesArray(regularSquares);

  this.squares.renderSquaresSet(regularSquares, this.canvas.shadows);

  this.squares.renderColoredSquares(regularSquares);
}

export function renderSquaresSet(this: Board, squares: Coords[], canvas: Canvas): void {

  squares.map(this.getSquare.coordsInCanvas)
    .map(canvas.getShape)
    .forEach(canvas.draw);
}

const SQUARE_COLORS_KEYS: SquareColor[] = ["light", "dark"];

export function renderColoredSquares(this: Board, squares: Coords[]): void {

  for (const color of SQUARE_COLORS_KEYS) {

    const sameColorSquares = squares.filter(this.isSquare[color]);

    const colorShades = this.colors.squares[color];

    this.squares.renderSquaresOfColor(sameColorSquares, colorShades)
  }
}

export function renderSquaresOfColor(
  this: Board,
  squares: Coords[],
  colorShades: Record<FaceType, string>
): void {

  for (const canvas of this.canvas.coloredCollection) {

    const coloredSquaresInCanvas =
      canvas.filter?.call(this, squares) || squares;

    canvas.ctx.fillStyle = colorShades[canvas.shape.type];

    this.squares.renderSquaresSet(coloredSquaresInCanvas, canvas)
  }
}
