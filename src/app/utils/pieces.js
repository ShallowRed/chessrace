export const pieces = {

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
      pieces.bishop.isValidMove(...args) ||
      pieces.rook.isValidMove(...args)
    )
  }
}

export const isValid = {

  move(pieceName, position, clickedSquare) {

    return pieces[pieceName].isValidMove(position, clickedSquare);
  },

  take(pieceName, position, clickedSquare) {

    return (
      pieceName === "pawn" &&
      pieces.pawn.isValidTake(position, clickedSquare)
    ) || (
      pieceName !== "pawn" &&
      this.move(pieceName, position, clickedSquare)
    )
  }
}

export function getSquaresOnTrajectory([x, y], [tx, ty]) {

  const deltaLength = Math.max(
    Math.abs(tx - x),
    Math.abs(ty - y)
  );

  return new Array(deltaLength - 1)
    .fill()
    .map((e, i) => {
      return [
        x + Math.sign(tx - x) * (i + 1),
        y + Math.sign(ty - y) * (i + 1)
      ];
    })
}
