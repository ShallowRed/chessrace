import GameObject from 'app/components/Game-object';

export function square(ctx, { left, top, size = GameObject.size }) {
  ctx.fillRect(left, top, size, size);
}

export function rectangle(ctx, { left = 0, top = 0, width, height }) {

  ctx.fillRect(left, top, width, height);
}

export function bottomFace(ctx, { left = 0, top = 0, size = GameObject.size }) {

  const { depth } = GameObject;

  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + size, top);
  ctx.lineTo(left + size + depth, top + depth);
  ctx.lineTo(left + depth, top + depth);
  ctx.closePath();
  ctx.fill();
}

export function rightFace(ctx, { left, top, size = GameObject.size }) {

  const { depth } = GameObject;

  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + depth, top + depth);
  ctx.lineTo(left + depth, top + size + depth);
  ctx.lineTo(left, top + size);
  ctx.closePath();
  ctx.fill();
}
