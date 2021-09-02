import GameObject from 'app/components/Game-object';

export function square({ left, top, size }) {
  this.ctx.fillRect(left, top, size, size);
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

export function horizontalLine(y, color, width = 4) {
  this.ctx.beginPath();
  this.ctx.moveTo(0, y);
  this.ctx.lineTo(this.canvas.width - GameObject.shadowShift, y);
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = width;
  this.ctx.stroke();
}

export const setShadow = {

  on() {
    const { shadowShift } = GameObject;
    this.ctx.fillStyle = "white";
    this.ctx2.fillStyle = "white";
    this.ctx.shadowColor = "#999";
    this.ctx2.shadowColor = "#999";
    this.ctx.shadowBlur = shadowShift / 2;
    this.ctx2.shadowBlur = shadowShift / 2;
  },

  off() {
    this.ctx.shadowColor = "transparent";
    this.ctx2.shadowColor = "transparent";
  }
}
