import GameObject from 'app/components/Game-object';
const { floor } = Math;

export function render() {

  const { squares, ctx, draw } = this;
  const { squareSize } = GameObject;

  const closestToTopLeftCorner = ([xa, ya], [xb, yb]) => {
    return xa - xb - ya + yb;
  }

  [...squares.list].sort(closestToTopLeftCorner)
    .forEach(([col, row]) => {
      const left = col * squareSize;
      const top = squares.getTop(row);
      const size = squareSize;

      ctx.fillStyle = squares.getColor([col, row], "right");
      draw.rightFace({ left: left + size, top, size });

      ctx.fillStyle = squares.getColor([col, row], "bottom");
      draw.bottomFace({ left, top: top + size, size });

      ctx.fillStyle = squares.getColor([col, row], "face");
      draw.square({ left, top, size });
    });
}

export function drawTest() {

  const { squares, testctx, draw } = this;
  const { squareSize } = GameObject;
  const { depth } = this;
  const size = squareSize;

  const testbottom = (col) => {
    testctx.beginPath();
    testctx.moveTo(col * size, 0);
    testctx.lineTo(col * size + size, 0);
    testctx.lineTo(col * size + size + depth, 0 + depth);
    testctx.lineTo(col * size + depth, 0 + depth);
    testctx.closePath();
    testctx.fill();
  }

  const testright = (col) => {

    testctx.beginPath();
    testctx.moveTo(col * size + size, -size);
    testctx.lineTo(col * size + size + depth, -size + depth);
    testctx.lineTo(col * size + size + depth, depth);
    testctx.lineTo(col * size + size, 0);
    testctx.closePath();
    testctx.fill();
  }

  [...squares.list]
  .filter(([x, y]) => y === this.nRenders)
    .sort(([xa], [xb]) => xa - xb)
    .forEach(([col, row]) => {

      testctx.fillStyle = squares.getColor([col, row], "bottom");
      testbottom(col);

      testctx.fillStyle = squares.getColor([col, row], "right");
      // testright(col);

    });

  if (squares.list.includes([8, this.nRenders])) {
    this.testctx.clearRect(8 * size, 0, depth, depth);
    testbottom(7);
  }
}

export function renderShadow() {

  const { squares, ctx, draw } = this;
  const { squareSize } = GameObject;

  squares.list.forEach(([col, row]) => {
    const left = col * squareSize + this.depth;
    const top = squares.getTop(row) + this.depth;
    const size = squareSize;
    draw.square({ left, top, size });
  });
}

export function getTop(row) {
  return GameObject.squareSize * (this.rows - row - 1 + this.nRenders) +
    GameObject.shadowShift;
}

export function getColor([col, row], key) {
  return [this.squareColors.dark[key], this.squareColors.light[key]][(col +
    row) % 2];
}

export function getClicked({ clientX, clientY }) {


  const { squareSize, shadowShift } = GameObject;
  const { left, bottom } = this.canvas.getBoundingClientRect();

  return [
    floor((clientX - left) / squareSize),
    floor((bottom - clientY - shadowShift) / squareSize)
  ];
}
