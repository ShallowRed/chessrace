import GameObject from 'app/components/Game-object';
const { floor } = Math;

export function render(ctx) {

  const { squares, draw } = this;

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
      draw.rightFace(ctx, { left: left + size, top, size });

      ctx.fillStyle = squares.getColor([col, row], "bottom");
      draw.bottomFace(ctx, { left, top: top + size, size });

      ctx.fillStyle = squares.getColor([col, row], "face");
      draw.square(ctx, { left, top, size });
    });
}

export function renderShadow(ctx) {

  const { squares, draw } = this;
  const { size, depth } = GameObject;

  squares.list.forEach(([col, row]) => {

    const left = squares.getLeft(col) + depth;
    const top = squares.getTop(row) + depth;

    draw.square(ctx, { left, top, size });
  });
}

export function renderBoardBottom(ctx) {

  const { squares, draw } = this;
  const { size } = GameObject;

  [...squares.list]
  .filter(([, row]) => row === this.nRenders)
    .forEach(([col, row]) => {

      ctx.fillStyle = squares.getColor([col, row], "bottom");

      const left = squares.getLeft(col);
      const top = 0;

      draw.bottomFace(ctx, { left, top, size }, true);
    });
}

export function includes(coord) {

  return this.squares.list
    .map(coords => coords.join(''))
    .includes(coord.join(''));
}


export function renderTrick(ctx) {

  const { squares } = this;
  const { depth, size } = GameObject;

  const row = this.nRenders;

  for (let col = 0; col < this.columns; col++) {

    if (this.squares.includes([col, row])) {

      ctx.fillStyle = "white";
      ctx.fillRect(squares.getLeft(col), depth, depth, size);

      ctx.fillStyle = this.squares.includes([col - 1, row + 1]) ?
        squares.getColor([col, row], "bottom") : "white";

      const left = squares.getLeft(col);

      ctx.beginPath();
      ctx.moveTo(left, 0);
      ctx.lineTo(left + depth, depth);
      ctx.lineTo(left, depth);
      ctx.closePath();
      ctx.fill();
    }
  }
}

export function getTop(row) {

  const { size, shadowShift } = GameObject;

  return (this.rows - row - 1 + this.nRenders) * size + shadowShift;
}

export function getLeft(col) {

  const { size, leftOffset } = GameObject;

  return size * col + leftOffset;
}

export function getColor([col, row], key) {

  return [
    this.squareColors.dark[key],
    this.squareColors.light[key]
  ][(col + row) % 2];
}

export function getClicked({ clientX, clientY }) {

  const { size, leftOffset, shadowShift } = GameObject;
  const offset = this.canvas.main.getBoundingClientRect();

  return [
    floor((clientX - offset.left - leftOffset) / size),
    floor(- (clientY - offset.bottom + shadowShift) / size)
  ];
}
