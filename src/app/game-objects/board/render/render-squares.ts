import { arrayIncludesArray } from "app/utils/array-includes-array";

import type Canvas from 'app/game-objects/board/models/canvas';
import type Board from 'app/game-objects/board/board';
import type { SquareColor } from 'app/game-objects/board/board-config';
import type { Coords, FaceType } from 'app/types';

export function render(this: Board, regularSquares: Coords[], isHeld: Held): void {

  this.squares.includes = arrayIncludesArray(regularSquares);

  this.squares.renderSquaresSet(regularSquares, this.canvas.shadows);

  this.squares.renderColoredSquares(regularSquares, isHeld);
}

// The lip is the underside the board shows at the bottom of the window. It is
// the only thing that has to be redrawn as the board scrolls, because it is
// the only thing that does not scroll with it.
export function renderLip(this: Board, regularSquares: Coords[], isHeld: Held): void {

  this.canvas.lowestBottomFace.clear();

  this.squares.renderColoredSquares(
    regularSquares, isHeld, [this.canvas.lowestBottomFace]
  );
}

export function renderSquaresSet(this: Board, squares: Coords[], canvas: Canvas): void {

  squares.map(this.getSquare.coordsInCanvas)
    .map(canvas.getShape)
    .forEach(canvas.draw);
}

const SQUARE_COLORS_KEYS: SquareColor[] = ["light", "dark"];

export type Held = (square: Coords) => boolean;

export function renderColoredSquares(
  this: Board,
  squares: Coords[],
  isHeld: Held,
  canvases: Canvas[] = this.canvas.coloredCollection
): void {

  for (const color of SQUARE_COLORS_KEYS) {

    const sameColorSquares = squares.filter(this.isSquare[color]);

    this.squares.renderSquaresOfColor(
      sameColorSquares.filter(square => !isHeld(square)),
      this.colors.squares[color],
      canvases
    );

    this.squares.renderSquaresOfColor(
      sameColorSquares.filter(isHeld),
      this.colors.held[color],
      canvases
    );
  }
}

export function renderSquaresOfColor(
  this: Board,
  squares: Coords[],
  colorShades: Record<FaceType, string>,
  canvases: Canvas[]
): void {

  for (const canvas of canvases) {

    const coloredSquaresInCanvas =
      canvas.filter?.call(this, squares) || squares;

    canvas.ctx.fillStyle = colorShades[canvas.shape.type];

    this.squares.renderSquaresSet(coloredSquaresInCanvas, canvas)
  }
}
