export default {

  isInBoard([col, row]) {

    return col >= 0 &&
      row >= 0 &&
      col < this.columns &&
      row <= this.rows &&
      row <= this.visibleRows;
  },

  get([col, row]) {

    return this.values[row]?. [col];
  },

  set([col, row], value) {

    this.values[row][col] = value;
  },

  removeEnnemy(squareCoords) {

    this.square.set(squareCoords, 1)
  },

  isHole(squareCoords) {

    return this.getSquare(squareCoords) === 0;
  },

  isEnnemy(squareCoords) {

    return this.getSquare(squareCoords) > 1;
  },

  isObstacle(squareCoords) {

    return this.square.isHole(squareCoords) ||
      this.square.isEnnemy(squareCoords)
  }
}
