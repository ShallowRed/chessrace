import GameObject from 'app/components/Game-object';

export function square(ctx, { left, top, size }) {
  ctx.fillRect(left, top, size, size);
}

export function rectangle(ctx, { left, top, width, height }) {
  ctx.fillRect(left, top, width, height);
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

export function cube(ctx, { left, top, size }, colors) {

  ctx.fillStyle = colors.right;
  this.draw.rightFace(ctx, { left: left + size, top, size });

  ctx.fillStyle = colors.bottom;
  this.draw.bottomFace(ctx, { left, top: top + size, size });

  ctx.fillStyle = colors.face;
  this.draw.square(ctx, { left, top, size });
}
