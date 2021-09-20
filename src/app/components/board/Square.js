import PlayArea from 'app/models/play-area';

const { floor } = Math;

export default {

  get: {

    left(col) {

      return col * PlayArea.size;
    },

    top(row) {

      return (this.rows - row + this.nRenders - 1) * PlayArea.size;
    },

    coordsInCanvas([col, row]) {

      return {
        left: this.square.get.left(col),
        top: this.square.get.top(row)
      };
    },

    clicked({ target, clientX, clientY }) {

      const { left, bottom } = target.getBoundingClientRect();

      const clientCoordsInCanvas = [
        clientX - left,
        -(clientY - bottom)
      ];

      const getSquareCoords = coords =>
        floor(coords / PlayArea.size);

      const [x, y] = clientCoordsInCanvas.map(getSquareCoords);

      return [x, y + this.nRenders - 1];
    }
  },

  is: {

    light([col, row]) {

      return (col + row) % 2
    },

    dark([col, row]) {

      return (col + row + 1) % 2
    },

    inBoard([col, row]) {

      return col >= 0 &&
        row >= 0 &&
        col < this.columns &&
        row <= this.rows;
    },

    inBottomRow(coords) {

      return coords[1] === this.nRenders - 1;
    },

    notInBottomRow(coords) {

      return coords[1] !== this.nRenders - 1;
    },

    leftToHole([col, row]) {

      return !this.squares.includes([col + 1, row]);
    },

    belowHole([col, row]) {

      return !this.squares.includes([col, row - 1]);
    }
  }
};
