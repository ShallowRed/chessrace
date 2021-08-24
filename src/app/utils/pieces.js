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

export const isValid = {

  moveSprite(pieceName, position, clickedSquare) {

    return Pieces[pieceName].isValidMove(position, clickedSquare);
  },

  take(pieceName, position, clickedSquare) {

    return (
      pieceName === "pawn" &&
      Pieces.pawn.isValidTake(position, clickedSquare)
    ) || (
      pieceName !== "pawn" &&
      this.moveSprite(pieceName, position, clickedSquare)
    )
  }
}
