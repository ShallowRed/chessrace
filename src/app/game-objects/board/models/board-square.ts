import PlayArea from 'app/game-objects/board/models/play-area';

import type Board from 'app/game-objects/board/board';
import type { Coords } from 'app/types';

const { floor } = Math;

export const getSquare = {

  left(col: number): number {

    return col * PlayArea.squareSize;
  },

  top(this: Board, row: number): number {

    return (this.rows - row + this.nRenders) * PlayArea.squareSize;
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

  clicked(this: Board, { target, clientX, clientY }: MouseEvent): Coords {

    const { left, bottom } = (target as HTMLElement).getBoundingClientRect();

    const col = this.getSquare.coord(clientX - left);

    const row = this.getSquare.coord(bottom - clientY);

    return [col, row + this.nRenders - 1];
  }
}

export const isSquare = {

  light([col, row]: Coords): number {

    return (col + row) % 2
  },

  dark([col, row]: Coords): number {

    return (col + row + 1) % 2
  },

  inBottomRow(this: Board, coords: Coords): boolean {

    return coords[1] === this.nRenders;
  },

  notInBottomRow(this: Board, coords: Coords): boolean {

    return coords[1] !== this.nRenders;
  },

  leftToHole(this: Board, [col, row]: Coords): boolean {

    return !this.squares.includes([col + 1, row]);
  },

  belowHole(this: Board, [col, row]: Coords): boolean {

    return !this.squares.includes([col, row - 1]);
  }
};
