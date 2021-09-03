import GameObject from 'app/components/Game-object';

export function square(ctx, { left, top, size }) {
  ctx.fillRect(left, top, size, size);
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

export function horizontalLine(ctx, y, color, width = 4) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export const setShadow = {

  on(ctx) {
    const { shadowShift } = GameObject;
    ctx.fillStyle = "white";
    ctx.shadowColor = "#999";
    ctx.shadowBlur = shadowShift / 2;
  },

  off(ctx) {
    ctx.shadowColor = "transparent";
  }
}
