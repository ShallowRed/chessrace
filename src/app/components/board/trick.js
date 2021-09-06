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

  this.trick.renderRectangle(ctx, col, left)

  const hasTopLeftNeighbour = this.squares.includes([col - 1, row + 1])
  const hasTopNeighbour = this.squares.includes([col, row + 1])

  if (hasTopLeftNeighbour) {

    this.trick.renderShadow(ctx, left);

    ctx.fillStyle = this.squares.getColor([col, row], "bottom");

  } else {

    ctx.fillStyle = "white";
  }

  this.trick.renderTriangle(ctx, left);

  if (!hasTopNeighbour) {
    const { depth, offset, size } = GameObject;

    ctx.fillStyle = "green";

    this.draw.rectangle(ctx, {
      left: left + size + depth,
      top: depth + offset.shadow * 2 - size ,
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

export function renderShadow(ctx, left) {

  const { depth, offset, size } = GameObject;

  ctx.setShadow.on();

  ctx.shadowColor = "blue";

  this.draw.rectangleShadow(ctx, {
    left: left - size + depth,
    top: depth - offset.shadow,
    width: size,
    height: offset.shadow
  });

  ctx.setShadow.off();
}
