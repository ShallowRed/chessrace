import GameObject from 'app/components/Game-object';

export function square({ left, top, size = GameObject.size }) {

  this.ctx.fillRect(left, top, size, size);
}

export function rectangle({ left = 0, top = 0, width, height }) {

  this.ctx.fillRect(left, top, width, height);
}

export function rightFace({ left, top, size = GameObject.size }) {

  const { depth } = GameObject;

  this.ctx.beginPath();
  this.ctx.moveTo(left + size, top);
  this.ctx.lineTo(left + size + depth, top + depth);
  this.ctx.lineTo(left + size + depth, top + size + depth);
  this.ctx.lineTo(left + size, top + size);
  this.ctx.closePath();
  this.ctx.fill();
}

export function bottomFace({ left = 0, top = 0, size = GameObject.size }) {

  const { depth } = GameObject;

  if (this.name === "lowestBottomFace") top = -size;

  this.ctx.beginPath();
  this.ctx.moveTo(left, top + size);
  this.ctx.lineTo(left + size, top + size);
  this.ctx.lineTo(left + size + depth, top + size + depth);
  this.ctx.lineTo(left + depth, top + size + depth);
  this.ctx.closePath();
  this.ctx.fill();
}

export function lowestBottomFace({ left = 0, size = GameObject.size }) {

  const { depth } = GameObject;

  this.ctx.beginPath();
  this.ctx.moveTo(left, 0);
  this.ctx.lineTo(left + size, 0);
  this.ctx.lineTo(left + size + depth, +depth);
  this.ctx.lineTo(left + depth, +depth);
  this.ctx.closePath();
  this.ctx.fill();
}
