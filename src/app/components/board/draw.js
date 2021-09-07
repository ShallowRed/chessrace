import GameObject from 'app/components/Game-object';

export function square({ left, top, size = GameObject.size }) {

  this.ctx.fillRect(left, top, size, size);
}

export function rectangle({ left = 0, top = 0, width, height }) {

  this.ctx.fillRect(left, top, width, height);
}

export function bottomFace({ left = 0, top = 0, size = GameObject.size }) {

  const { depth } = GameObject;

  this.ctx.beginPath();
  this.ctx.moveTo(left, top);
  this.ctx.lineTo(left + size, top);
  this.ctx.lineTo(left + size + depth, top + depth);
  this.ctx.lineTo(left + depth, top + depth);
  this.ctx.closePath();
  this.ctx.fill();
}

export function rightFace({ left, top, size = GameObject.size }) {

  const { depth } = GameObject;

  this.ctx.beginPath();
  this.ctx.moveTo(left, top);
  this.ctx.lineTo(left + depth, top + depth);
  this.ctx.lineTo(left + depth, top + size + depth);
  this.ctx.lineTo(left, top + size);
  this.ctx.closePath();
  this.ctx.fill();
}
