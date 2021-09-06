// import GameObject from 'app/components/Game-object';

export function render() {

  const ctx = this.ctx.main;

  const cubes = this.squares.list
    .filter(this.squares.isInVisibleRow)
    .sort(closestToTopLeftCorner)
    .map(this.cubes.getCube);

  ctx.setShadow.on();

  cubes.forEach(cube =>
    this.draw.cubeShadow(ctx, cube)
  );

  ctx.setShadow.off();

  cubes.forEach(cube =>
    this.draw.cube(ctx, cube)
  );
}

export function getCube(coords) {

  return {

    face: this.squares.getSquare(coords),

    colors: {
      right: this.squares.getColor(coords, "right"),
      bottom: this.squares.getColor(coords, "bottom"),
      face: this.squares.getColor(coords, "face")
    }
  }
}


function closestToTopLeftCorner([xa, ya], [xb, yb]) {
  return xa - xb - ya + yb;
}
