import GameObject from 'app/components/Game-object';
const { floor } = Math;

export function render() {

  const { squares, ctx, draw } = this;

  const closestToTopLeftCorner = ([xa, ya], [xb, yb]) => {
    return xa - xb - ya + yb;
  }

  const { size } = GameObject;

  [...squares.list]
  .filter(([, y]) => y > this.nRenders - 1)
    .sort(closestToTopLeftCorner)
    .forEach(([col, row]) => {

      const top = squares.getTop(row);
      const left = squares.getLeft(col);

      ctx.fillStyle = squares.getColor([col, row], "right");
      draw.rightFace(this.ctx, { left: left + size, top, size });

      ctx.fillStyle = squares.getColor([col, row], "bottom");
      draw.bottomFace(this.ctx, { left, top: top + size, size });

      ctx.fillStyle = squares.getColor([col, row], "face");
      draw.square({ left, top, size });
    });
}

export function renderShadow() {

  const { squares, draw } = this;
  const { size, depth } = GameObject;

  squares.list.forEach(([col, row]) => {

    const left = squares.getLeft(col) + depth;
    const top = squares.getTop(row) + depth;

    draw.square({ left, top, size });
  });
}

export function renderFirstRowBottom() {

  const { squares, ctx2, draw } = this;
  const { size } = GameObject;

  [...squares.list]
  .filter(([, row]) => row === this.nRenders)
    .forEach(([col, row]) => {

      ctx2.fillStyle = squares.getColor([col, row], "bottom");

      const left = squares.getLeft(col);
      const top = 0;

      draw.bottomFace(ctx2, { left, top, size }, true);
    });
}

export function includes(coord) {

  return this.squares.list
    .map(coords => coords.join(''))
    .includes(coord.join(''));
}


export function renderTrick() {

  const { squares, ctx3 } = this;
  const { depth, size } = GameObject;

  const row = this.nRenders;

  for (let col = 0; col < this.columns; col++) {

    if (this.squares.includes([col, row])) {

      ctx3.fillStyle = "white";
      ctx3.fillRect(squares.getLeft(col), depth, depth, size);

      ctx3.fillStyle = this.squares.includes([col - 1, row + 1]) ?
        squares.getColor([col, row], "bottom") : "white";

      const left = squares.getLeft(col);

      ctx3.beginPath();
      ctx3.moveTo(left, 0);
      ctx3.lineTo(left + depth, depth);
      ctx3.lineTo(left, depth);
      ctx3.closePath();
      ctx3.fill();
    }
  }
}

export function getTop(row) {

  const { size, shadowShift } = GameObject;

  return (this.rows - row - 1 + this.nRenders) * size + shadowShift;
}

export function getLeft(col) {

  const { size, left } = GameObject;

  return size * col + left;
}

export function getColor([col, row], key) {

  return [
    this.squareColors.dark[key],
    this.squareColors.light[key]
  ][(col + row) % 2];
}

export function getClicked({ clientX, clientY }) {

  const { size, left, shadowShift } = GameObject;
  const coords = this.canvas.getBoundingClientRect();

  return [
    floor((clientX - coords.left - left) / size),
    floor(- (clientY - coords.bottom + shadowShift) / size)
  ];
}
