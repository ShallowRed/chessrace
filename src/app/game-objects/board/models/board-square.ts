import PlayArea from 'app/game-objects/board/models/play-area';

import type Board from 'app/game-objects/board/board';
import type { Coords } from 'app/types';

const { floor } = Math;

export const getSquare = {

  left(col: number): number {

    return col * PlayArea.squareSize;
  },

  top(this: Board, row: number): number {

    return (this.boardRows - row) * PlayArea.squareSize;
  },

  coordsInCanvas(this: Board, [col, row]: Coords): { left: number; top: number } {

    return {
      left: this.getSquare.left(col),
      top: this.getSquare.top(row)
    };
  },

  coord(coordInCanvas: number): number {

    return floor(coordInCanvas / PlayArea.squareSize)
  },

  // The canvas holds the whole level and carries the scroll in its own
  // transform, so where it was clicked is already where the board was clicked.
  clicked(this: Board, { target, clientX, clientY }: MouseEvent): Coords {

    const { left, bottom } = (target as HTMLElement).getBoundingClientRect();

    return [
      this.getSquare.coord(clientX - left),
      this.getSquare.coord(bottom - clientY)
    ];
  }
}

export const isSquare = {

  light([col, row]: Coords): number {

    return (col + row) % 2
  },

  dark([col, row]: Coords): number {

    return (col + row + 1) % 2
  },

  // The floor is the level's own bottom row, whose underside is never drawn
  // with the rest: the lip is, and the lip is whichever row the window ends on.
  notOnTheFloor(coords: Coords): boolean {

    return coords[1] !== 0;
  },

  atTheLip(this: Board, coords: Coords): boolean {

    return coords[1] === this.lipRow;
  },

  leftToHole(this: Board, [col, row]: Coords): boolean {

    return !this.squares.includes([col + 1, row]);
  },

  belowHole(this: Board, [col, row]: Coords): boolean {

    return !this.squares.includes([col, row - 1]);
  }
};
