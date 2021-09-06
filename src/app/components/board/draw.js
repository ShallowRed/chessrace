import GameObject from 'app/components/Game-object';

export function square(ctx, { left, top, size }) {

  ctx.fillRect(left, top, size, size);
}

export function rectangle(ctx, { left, top, width, height }) {

  ctx.fillRect(left, top, width, height);
}

export function squareShadow(ctx, { left, top, size }) {

  this.draw.square(ctx, {
    left: left - ctx.canvas.width,
    top: top - ctx.canvas.height,
    size,
  });
}

export function cubeShadow(ctx, { face: { left, top, size } }) {

  const { depth } = GameObject;

  this.draw.square(ctx, {
    left: left + depth - ctx.canvas.width,
    top: top + depth - ctx.canvas.height,
    size,
  });
}

export function rectangleShadow(ctx, { left, top, width, height }) {

  this.draw.rectangle(ctx, {
    left: left - ctx.canvas.width,
    top: top - ctx.canvas.height,
    width,
    height
  });
}

export function bottomFace(ctx, { left, top, size }) {

  const { depth } = GameObject;

  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + size, top);
  ctx.lineTo(left + size + depth, top + depth);
  ctx.lineTo(left + depth, top + depth);
  ctx.closePath();
  ctx.fill();
}

export function rightFace(ctx, { left, top, size }) {

  const { depth } = GameObject;

  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + depth, top + depth);
  ctx.lineTo(left + depth, top + size + depth);
  ctx.lineTo(left, top + size);
  ctx.closePath();
  ctx.fill();
}

export function cube(ctx, { face: { left, top, size }, colors }) {

  ctx.fillStyle = colors.right;
  rightFace(ctx, { left: left + size, top, size });

  ctx.fillStyle = colors.bottom;
  bottomFace(ctx, { left, top: top + size, size });

  ctx.fillStyle = colors.face;
  square(ctx, { left, top, size });
}
