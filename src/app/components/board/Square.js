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

    clicked({ clientX, clientY }) {

      const { left, bottom } =
      this.canvas.frontFaces.domEl.getBoundingClientRect();

      const [x, y] = [
        clientX - left,
        -(clientY - bottom)
      ].map(coords =>
        floor(coords / PlayArea.size)
      );

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
