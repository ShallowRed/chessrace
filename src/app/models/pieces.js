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

export function getSortedPiecesNames(pieceName) {
  return Object.keys(Pieces)
    .sort();
}

const Pieces = {

  pawn: {
    isValidMove: ([x, y], [tx, ty]) => (
      ty === y + 1 &&
      x === tx
    ),
    isValidTake: ([x, y], [tx, ty]) => (
      ty === y + 1 &&
      (
        tx === x - 1 ||
        tx === x + 1
      )
    )
  },

  king: {
    isValidMove: ([x, y], [tx, ty]) => (
      abs(x - tx) <= 1 &&
      abs(y - ty) <= 1
    )
  },

  knight: {
    isValidMove: ([x, y], [tx, ty]) => (
      abs(x - tx) === 2 &&
      abs(y - ty) === 1
    ) || (
      abs(x - tx) === 1 &&
      abs(y - ty) === 2
    )
  },

  bishop: {
    isValidMove: ([x, y], [tx, ty]) => (
      abs(x - tx) === abs(y - ty)
    )
  },

  rook: {
    isValidMove: ([x, y], [tx, ty]) => (
      x === tx ||
      y === ty
    )
  },

  queen: {
    isValidMove: (...coords) => (
      Pieces.bishop.isValidMove(...coords) ||
      Pieces.rook.isValidMove(...coords)
    )
  }
}
