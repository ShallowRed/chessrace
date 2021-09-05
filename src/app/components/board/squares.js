import GameObject from 'app/components/Game-object';

const { floor } = Math;

export function getTop(row) {

  const { size, offset } = GameObject;

  const bottom = (row - this.nRenders) * size + offset.bottom;

  return this.canvas.main.height - bottom;
}

export function getLeft(col) {

  const { size, offset } = GameObject;

  return size * col + offset.left;
}

export function get([col, row]) {

  const { size, offset } = GameObject;

  return {
    left: this.squares.getLeft(col),
    top: this.squares.getTop(row),
    size
  };
}

export function getColor([col, row], key) {

  return [
    this.colors.squares.dark[key],
    this.colors.squares.light[key]
  ][(col + row) % 2];
}

export function isInVisibleRow([, row]) {
  return row > this.nRenders - 1
}

export function isInBottomRow([, row]) {
  return row === this.nRenders;
}

export function includes(coord) {

  return this.squares.list
    .map(coords => coords.join(''))
    .includes(coord.join(''));
}

export function getClicked({ clientX, clientY }) {

  const { size, offset } = GameObject;

  const canvasOffset = this.canvas.main.getBoundingClientRect();

  const coords = [
    clientX - canvasOffset.left - offset.left,
    -(clientY - canvasOffset.bottom + offset.bottom - size)
  ];

  return coords.map(coord => floor(coord / size))
}
