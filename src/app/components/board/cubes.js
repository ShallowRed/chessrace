import GameObject from 'app/components/Game-object';

export function render() {

  const cubes = this.squares.list
    .filter(this.squares.isInVisibleRow)
    .sort(closestToTopLeftCorner);

  this.cubes.renderShadows(this.ctx.main, cubes)
  cubes.forEach(this.cubes.renderCube);
}

export function renderCube(coords) {

  const square = this.squares.get(coords);
  const colors = this.cubes.getColors(coords)

  this.draw.cube(this.ctx.main, square, colors)
};

export function renderShadows(ctx, cubes) {

  ctx.setShadow.on();
  cubes.forEach(this.cubes.renderShadow);
  ctx.setShadow.off();
}

export function getColors(coords) {
  const { getColor } = this.squares;

  return {
    right: getColor(coords, "right"),
    bottom: getColor(coords, "bottom"),
    face: getColor(coords, "face")
  }
}

export function renderShadow([col, row]) {

  const { size } = GameObject;
  const ctx = this.ctx.main;

  this.draw.square(ctx, {
    left: this.squares.getLeft(col) - ctx.canvas.width,
    top: this.squares.getTop(row) - ctx.canvas.height,
    size: size
  });
}

function closestToTopLeftCorner([xa, ya], [xb, yb]) {
  return xa - xb - ya + yb;
}
