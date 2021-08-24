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
      Math.abs(x - tx) <= 1 &&
      Math.abs(y - ty) <= 1
    )
  },

  knight: {
    isValidMove: ([x, y], [tx, ty]) => (
      Math.abs(x - tx) === 2 &&
      Math.abs(y - ty) === 1
    ) || (
      Math.abs(x - tx) === 1 &&
      Math.abs(y - ty) === 2
    )
  },

  bishop: {
    isValidMove: ([x, y], [tx, ty]) => (
      Math.abs(x - tx) === Math.abs(y - ty)
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

  move(pieceName, position, clickedSquare) {

    return Pieces[pieceName].isValidMove(position, clickedSquare);
  },

  take(pieceName, position, clickedSquare) {

    return (
      pieceName === "pawn" &&
      Pieces.pawn.isValidTake(position, clickedSquare)
    ) || (
      pieceName !== "pawn" &&
      this.move(pieceName, position, clickedSquare)
    )
  }
}
