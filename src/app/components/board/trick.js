import GameObject from 'app/components/Game-object';

export function render() {

  const ctx = this.ctx.trick;

  for (let col = 0; col < this.columns; col++) {

    if (this.squares.includes([col, this.nRenders])) {

      this.trick.renderSquare(ctx, col, this.nRenders);
    }
  }
}

export function renderSquare(ctx, col, row) {

  const left = this.squares.getLeft(col);
  const { depth, offset, size } = GameObject;

  this.trick.renderRectangle(ctx, col, left)

  const hasTopLeftNeighbour = this.squares.includes([col - 1, row + 1])
  const hasTopNeighbour = this.squares.includes([col, row + 1])
  const hasLeftNeighbour = this.squares.includes([col + 1, row])

  if (hasTopLeftNeighbour) {

    ctx.setShadow.on();

    this.draw.rectangleShadow(ctx, {
      left: left - size + depth,
      top: depth - offset.shadow,
      width: size,
      height: offset.shadow
    });

    ctx.setShadow.off();

    ctx.fillStyle = this.squares.getColor([col, row], "bottom");

  } else {

    ctx.fillStyle = "white";
  }

  this.trick.renderTriangle(ctx, left);

  if (!hasTopNeighbour) {

    this.ctx.trickShadow.fillStyle = "white";
    // this.ctx.trickShadow.fillStyle = "purple";

    this.draw.rectangle(this.ctx.trickShadow, {
      left: left + depth + offset.shadow,
      top: 0,
      width: size,
      height: offset.shadow
    });
  }

  if (!hasTopNeighbour && !hasLeftNeighbour) {
    const { depth, offset, size } = GameObject;

    this.ctx.trickShadow.fillStyle = "white";
    // this.ctx.trickShadow.fillStyle = "red";

    this.draw.rectangle(this.ctx.trickShadow, {
      left: left + size + depth,
      top: 0,
      width: offset.shadow,
      height: offset.shadow
    });
  }
}

export function renderRectangle(ctx, col, left) {

  const { depth, offset, size } = GameObject;

  ctx.fillStyle = "white";

  this.draw.rectangle(ctx, {
    left: left,
    top: depth,
    width: offset.shadow + depth,
    height: size
  });
}

export function renderTriangle(ctx, left) {

  const { depth } = GameObject;

  ctx.beginPath();
  ctx.moveTo(left, 0);
  ctx.lineTo(left + depth, depth);
  ctx.lineTo(left, depth);
  ctx.closePath();
  ctx.fill();
}
