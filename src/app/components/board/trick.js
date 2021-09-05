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

  if (hasTopLeftNeighbour) {

    this.trick.renderShadow(ctx, left);

    ctx.fillStyle = this.squares.getColor([col, row], "bottom");

  } else {

    ctx.fillStyle = "white";
  }

  this.trick.renderTriangle(ctx, [col, row], left);
}

export function renderRectangle(ctx, col, left) {

  const { depth, offset, size } = GameObject;

  ctx.fillStyle = "white";

  this.draw.rectangle(ctx, {
    left: left - 1,
    top: depth,
    width: depth + offset.shadow + 1,
    height: size
  });
}

export function renderTriangle(ctx, [col, row], left) {

  const { depth } = GameObject;

  ctx.beginPath();
  ctx.moveTo(left - 1, 0);
  ctx.lineTo(left + depth, depth);
  ctx.lineTo(left - 1, depth);
  ctx.closePath();
  ctx.fill();
}

export function renderShadow(ctx, left) {

  const { depth, offset } = GameObject;

  ctx.setShadow.on();

  this.draw.rectangle(ctx, {
    left: left - ctx.canvas.width - offset.shadow - 1,
    top: -ctx.canvas.height - offset.shadow + depth - 1,
    width: offset.shadow + 1,
    height: offset.shadow - depth
  });

  ctx.setShadow.off();
}
