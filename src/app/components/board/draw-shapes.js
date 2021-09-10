import GameObject from 'app/components/Game-object';

export function square({ left, top, size = GameObject.size }) {

  this.fillRect(left, top, size, size);
}

export function rectangle({ left = 0, top = 0, width, height }) {

  this.fillRect(left, top, width, height);
}

export function innerStrokeRectangle({ left = 0, top = 0, width, height, }) {

  const bW = this.lineWidth;

  this.strokeRect(
    left + bW / 2,
    top + bW / 2,
    width - bW,
    height - bW
  );
}

export function rightFace({ left, top, size = GameObject.size }) {

  const { depth } = GameObject;

  this.beginPath();
  this.moveTo(left, top);
  this.lineTo(left + depth, top + depth);
  this.lineTo(left + depth, top + size + depth);
  this.lineTo(left, top + size);
  this.closePath();
  this.fill();
}

export function bottomFace({ left = 0, top = 0, size = GameObject.size }) {

  const { depth } = GameObject;

  this.beginPath();
  this.moveTo(left, top + GameObject.size);
  this.lineTo(left + size, top + GameObject.size);
  this.lineTo(left + size + depth, top + GameObject.size + depth);
  this.lineTo(left + depth, top + GameObject.size + depth);
  this.closePath();
  this.fill();
}

export function lowestBottomFace({ left = 0, size = GameObject.size }) {

  const { depth } = GameObject;

  this.beginPath();
  this.moveTo(left, 0);
  this.lineTo(left + size, 0);
  this.lineTo(left + size + depth, +depth);
  this.lineTo(left + depth, +depth);
  this.closePath();
  this.fill();
}
