import GameObject from 'app/components/Game-object';

export function square({ left, top, size }) {
  this.ctx.fillRect(left, top, size, size);
}

export function bottomFace({ left, top, size }) {
  const { depth } = this;

  this.ctx.beginPath();
  this.ctx.moveTo(left, top);
  this.ctx.lineTo(left + size, top);
  this.ctx.lineTo(left + size + depth, top + depth);
  this.ctx.lineTo(left + depth, top + depth);
  this.ctx.closePath();
  this.ctx.fill();
}

export function rightFace({ left, top, size }) {
  const { depth } = this;

  this.ctx.beginPath();
  this.ctx.moveTo(left, top);
  this.ctx.lineTo(left + depth, top + depth);
  this.ctx.lineTo(left + depth, top + size + depth);
  this.ctx.lineTo(left, top + size);
  this.ctx.closePath();
  this.ctx.fill();
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
    this.testctx.fillStyle = "white";
    this.ctx.fillStyle = "white";
    this.testctx.shadowColor = "#999";
    this.ctx.shadowColor = "#999";
    this.testctx.shadowBlur = shadowShift / 3;
    this.ctx.shadowBlur = shadowShift / 3;
    // this.ctx.shadowOffsetX = shadowShift / 5;
    // this.ctx.shadowOffsetY = shadowShift / 5;
  },

  off() {
    this.testctx.shadowColor = "transparent";
    this.ctx.shadowColor = "transparent";
  }
}
