import GameObject from 'app/components/Game-object';

const { floor } = Math;

export function render() {

  const visibleSquares = this.squares.list
    .filter(this.squares.isVisible);

  visibleSquares.map(this.squares.getShadowCanvasCoords)
    .forEach(this.canvas.shadows.draw.square);

  for (const canvas of this.coloredCanvas) {
    for (const color of ["light", "dark"]) {

      canvas.ctx.fillStyle = this.colors.squares[color][canvas.name];

      let squares = visibleSquares.filter(this.squares.isSquare[color]);

      canvas.filter && (squares = canvas.filter(squares));

      squares.map(this.squares.getCanvasCoords)
        .forEach(canvas.draw[canvas.shape])
    }
  }
}

export function getLeft(coords) {

  return coords[0] * GameObject.size;
}

export function getBottom(coords) {

  return (coords[1] + 1 - this.nRenders) * GameObject.size;
}

export function getTop(coords) {

  return this.canvas.frontFace.height - this.squares.getBottom(coords);
}

export function getCanvasCoords(coords) {

  return {
    left: this.squares.getLeft(coords),
    top: this.squares.getTop(coords)
  }
}

export function getShadowCanvasCoords(coords) {

  const { offset, depth } = GameObject

  return {
    left: this.squares.getLeft(coords),
    top: this.squares.getTop(coords) + offset.shadow + depth
  }
}

export const isSquare = {

  light([col, row]) {
    return (col + row) % 2
  },

  dark([col, row]) {
    return (col + row + 1) % 2
  }
}

export function isLightSquare([col, row]) {
  return (col + row) % 2
}

export function isDarkSquare([col, row]) {
  return (col + row + 1) % 2
}

export function isVisible(coords) {
  return coords[1] > this.nRenders - 1
}

export function isNotInBottomRow(coords) {
  return coords[1] !== this.nRenders;
}

export function isInBottomRow(coords) {
  return coords[1] === this.nRenders;
}

export function hasNoRightNeighbour([col, row]) {
  return !this.squares.includes([col + 1, row]);
}

export function hasNoTopNeighbour([col, row]) {
  return !this.squares.includes([col, row - 1]);
}

export function includes(coord) {

  return this.squares.list
    .map(coords => coords.join(''))
    .includes(coord.join(''));
}

export function getClicked({ clientX, clientY }) {

  const { left, bottom } = this.canvas.frontFace.domEl
    .getBoundingClientRect();

  return [
    clientX - left,
    -(clientY - bottom)
  ].map(coord => floor(coord / GameObject.size));
}
