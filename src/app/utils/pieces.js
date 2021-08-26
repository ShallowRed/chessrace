const { abs } = Math;

export const Pieces = {

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
    isValidMove: (...args) => (
      Pieces.bishop.isValidMove(...args) ||
      Pieces.rook.isValidMove(...args)
    )
  }
}

export function isValidMove({ pieceName, position }, square) {

  return Pieces[pieceName].isValidMove(position, square);
}

export function isValidTake({ pieceName, position }, square) {

  return (
    pieceName === "pawn" &&
    Pieces.pawn.isValidTake(position, square)
  ) || (
    pieceName !== "pawn" &&
    isValidMove({ pieceName, position }, square)
  )
}
