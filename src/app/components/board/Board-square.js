import GameObject from 'app/components/Game-object';

const { floor } = Math;

export const get = {

  left(col) {

    return col * GameObject.size;
  },

  top(row) {

    return (this.rows - row + this.nRenders - 1) * GameObject.size;
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

    const boardSquare = [
      clientX - left,
      -(clientY - bottom)
    ].map(coord => floor(coord / GameObject.size));

    return [
      boardSquare[0],
      boardSquare[1] + this.nRenders - 1
    ]
  }
}

export const is = {

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
