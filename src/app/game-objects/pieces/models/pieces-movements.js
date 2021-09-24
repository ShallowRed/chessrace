const { abs } = Math;

export function isValidMove({ position, pieceName }, targetPosition) {

  return Pieces[pieceName].isValidMove(position, targetPosition);
}

export function isValidTake({ position, pieceName }, ennemyPosition) {

  const isValidAction = pieceName === "pawn" ?
    "isValidTake" :
    "isValidMove";

  return Pieces[pieceName][isValidAction](position, ennemyPosition);
}

export function isLongRange(pieceName) {
  return ["bishop", "rook", "queen"].includes(pieceName);
}

const Pieces = {

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
    isValidMove: ([x1, y1], [x2, y2]) => (
      abs(x1 - x2) === abs(y1 - y2)
    )
  },

  rook: {
    isValidMove: ([x1, y1], [x2, y2]) => (
      x1 === x2 ||
      y1 === y2
    )
  },

  queen: {
    isValidMove: (...coords) => (
      Pieces.bishop.isValidMove(...coords) ||
      Pieces.rook.isValidMove(...coords)
    )
  }
}
