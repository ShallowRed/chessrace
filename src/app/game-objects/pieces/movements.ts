import type { Coords, PieceName } from 'app/types';

const { abs } = Math;

export type Side = "player" | "enemy";

// Forward is up the board for the player, who is climbing it, and down it for
// the enemies, who are facing them. The pawn is the only piece that can tell
// the difference, and reading it the wrong way round aims its threat at the
// two squares behind it.
const forward = (side: Side) => side === "player" ? 1 : -1;

type MoveTest = (from: Coords, to: Coords, forward: number) => boolean;

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
  targetPosition: Coords,
  side: Side = "player"
): boolean {

  return (
    !isSameSquare(position, targetPosition) &&
    Pieces[pieceName].isValidMove(position, targetPosition, forward(side))
  );
}

export function isValidTake(
  { position, pieceName }: MovingPiece,
  enemyPosition: Coords,
  side: Side = "player"
): boolean {

  return (
    !isSameSquare(position, enemyPosition) &&
    (
      Pieces[pieceName].isValidTake ||
      Pieces[pieceName].isValidMove
    )(position, enemyPosition, forward(side))
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

    isValidMove: ([x1, y1], [x2, y2], forward) => (
      y2 === y1 + forward &&
      x1 === x2
    ),

    isValidTake: ([x1, y1], [x2, y2], forward) => (
      y2 === y1 + forward &&
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
