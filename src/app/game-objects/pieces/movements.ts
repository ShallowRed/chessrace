import type { Coords, PieceName } from 'app/types';

const { abs } = Math;

type MoveTest = (from: Coords, to: Coords) => boolean;

interface PieceMoves {
  isValidMove: MoveTest;
  isValidTake?: MoveTest;
  isLongRange?: boolean;
}

interface MovingPiece {
  position: Coords;
  pieceName: PieceName;
}

export function isValidMove(
  { position, pieceName }: MovingPiece,
  targetPosition: Coords
): boolean {

  return (
    !isSameSquare(position, targetPosition) &&
    Pieces[pieceName].isValidMove(position, targetPosition)
  );
}

export function isValidTake(
  { position, pieceName }: MovingPiece,
  enemyPosition: Coords
): boolean {

  return (
    !isSameSquare(position, enemyPosition) &&
    (
      Pieces[pieceName].isValidTake ||
      Pieces[pieceName].isValidMove
    )(position, enemyPosition)
  );
}

export function isLongRange(pieceName: PieceName): boolean {

  return Pieces[pieceName].isLongRange === true;
}

function isSameSquare([x1, y1]: Coords, [x2, y2]: Coords): boolean {

  return x1 === x2 && y1 === y2;
}

const Pieces: Record<PieceName, PieceMoves> = {

  pawn: {

    isValidMove: ([x1, y1], [x2, y2]) => (
      y2 === y1 + 1 &&
      x1 === x2
    ),

    isValidTake: ([x1, y1], [x2, y2]) => (
      y2 === y1 + 1 &&
      (
        x2 === x1 - 1 ||
        x2 === x1 + 1
      )
    )
  },

  king: {

    isValidMove: ([x1, y1], [x2, y2]) => (
      abs(x1 - x2) <= 1 &&
      abs(y1 - y2) <= 1
    )
  },

  knight: {

    isValidMove: ([x1, y1], [x2, y2]) => (
      abs(x1 - x2) === 2 &&
      abs(y1 - y2) === 1
    ) || (
      abs(x1 - x2) === 1 &&
      abs(y1 - y2) === 2
    )
  },

  bishop: {

    isLongRange: true,

    isValidMove: ([x1, y1], [x2, y2]) => (
      abs(x1 - x2) === abs(y1 - y2)
    )
  },

  rook: {

    isLongRange: true,

    isValidMove: ([x1, y1], [x2, y2]) => (
      x1 === x2 ||
      y1 === y2
    )
  },

  queen: {

    isLongRange: true,

    isValidMove: (...coords) => (
      Pieces.bishop.isValidMove(...coords) ||
      Pieces.rook.isValidMove(...coords)
    )
  }
};
