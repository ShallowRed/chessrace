import GameObject from 'app/components/Game-object';

const { floor } = Math;

export function render(regularSquares) {

  const { getShadowCoordsInCanvas, getCoordsInCanvas, isSquare } = this.squares;

  this.squares.list = regularSquares;

  regularSquares.map(getShadowCoordsInCanvas)
    .forEach(this.canvas.shadows.draw.square);

  for (const color of ["light", "dark"]) {

    const sameColorSquares = regularSquares.filter(isSquare[color]);

    for (const [name, canvas] of this.coloredCanvas) {

      canvas.ctx.fillStyle = this.colors.squares[color][name];

      const squares = canvas.filter?.(sameColorSquares) ||
        sameColorSquares;

      squares.map(getCoordsInCanvas)
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

export function getCoordsInCanvas(coords) {

  return {
    left: this.squares.getLeft(coords),
    top: this.squares.getTop(coords)
  }
}

export function getShadowCoordsInCanvas(coords) {

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
