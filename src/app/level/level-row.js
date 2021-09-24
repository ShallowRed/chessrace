import { filterMap } from 'app/utils/filter-and-map-array';

export default {

  parse(rowIndex) {

    const row = this.values[rowIndex];

    return {

      regularSquares: filterMap(row, {
        filter: this.row.isNotHole,
        map: this.row.getSquareCoords(rowIndex)
      }),

      newEnnemies: filterMap(row, {
        filter: this.row.isPiece,
        map: this.row.getPiecePositionAndName(row, rowIndex)
      })
    }
  },

  isNotHole({ value }) {

    return value > 0;
  },

  isPiece({ value }) {

    return value > 1;
  },

  getSquareCoords(rowIndex) {

    return ({ index }) => [index, rowIndex];
  },

  getPiecePositionAndName(row, rowIndex) {

    return ({ index }) => ({
      pieceName: this.row.getPieceName(row, index),
      position: [index, rowIndex]
    });
  },

  getPieceName(row, index) {

    return this.pieces[row[index] - 2];
  }
}
