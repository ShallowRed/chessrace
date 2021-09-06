import GameObject from 'app/components/Game-object';

export function render() {

  const ctx = this.ctx.bottomFace;

  const bottomSquares = this.squares.list
    .filter(this.squares.isInBottomRow);

  this.bottomFace.clearShadows(ctx);
  ctx.setShadow.on();
  bottomSquares.forEach(this.bottomFace.renderShadow);
  ctx.setShadow.off();

  bottomSquares.forEach(this.bottomFace.renderCubeFace);
}

export function renderCubeFace([col, row]) {

  const ctx = this.ctx.bottomFace;
  const { size } = GameObject;

  ctx.fillStyle = this.squares.getColor([col, row], "bottom");

  this.draw.bottomFace(ctx, {
    left: this.squares.getLeft(col),
    top: 0,
    size
  });
}

export function clearShadows(ctx) {

  const { depth, offset } = GameObject;

  ctx.clearRect(
    0,
    depth,
    this.canvas.bottomFace.width,
    offset.shadow - depth
  );
}


export function renderShadow([col]) {

  const { size, offset, depth } = GameObject;

  const ctx = this.ctx.bottomFace;

  ctx.shadowColor = "red";

  // this.draw.rectangleShadow(ctx, {
  //   left: this.squares.getLeft(col) + depth,
  //   top: depth - offset.shadow,
  //   width: size,
  //   height: offset.shadow
  // })
}
