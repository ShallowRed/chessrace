import GameObject from 'app/components/Game-object';

const { floor } = Math;

export function render() {

  const { depth, size, offset } = GameObject;

  this.squares.list
    .filter(this.squares.isInVisibleRow)
    .forEach(square => {

      const left = this.squares.getLeft(square);
      const top = this.squares.getTop(square);

      this.draw.square(this.ctx.shadows, {
        left: left - this.canvas.shadows.width + depth,
        top: top - offset.shadow - this.canvas.shadows.height,
        size,
      });

      this.ctx.face.fillStyle = this.squares.getColor(square, "face");
      this.draw.square(this.ctx.face, { left, top });

      if (!this.squares.hasRightNeighbour(square)) {

        this.ctx.right.fillStyle = this.squares.getColor(square, "right");
        this.draw.rightFace(this.ctx.right, {
          left: left + size,
          top: top - depth
        });
      }

      if (
        !this.squares.isInBottomRow(square) &&
        !this.squares.hasTopNeighbour(square)
      ) {
        this.ctx.bottom.fillStyle = this.squares.getColor(square, "bottom");
        this.draw.bottomFace(this.ctx.bottom, {
          left,
          top: top + size - depth
        });
      }
    });

  this.squares.list
    .filter(this.squares.isInBottomRow)
    .forEach(square => {

      this.ctx.bottomFace.fillStyle =
        this.squares.getColor(square, "bottom");

      this.draw.bottomFace(this.ctx.bottomFace, {
        left: this.squares.getLeft(square)
      });
    });
}

export function getTop(coord) {

  const row = coord.length ? coord[1] : coord;

  const { size } = GameObject;

  const bottom = (row + 1 - this.nRenders) * size;

  return this.canvas.face.height - bottom;
}

export function getLeft(coord) {

  const col = coord.length ? coord[0] : coord;

  const { size } = GameObject;

  return size * col;
}

export function getColor([col, row], key) {

  return [
    this.colors.squares.dark[key],
    this.colors.squares.light[key]
  ][(col + row) % 2];
}

export function isInVisibleRow(coords) {
  return coords[1] > this.nRenders - 1
}

export function isInBottomRow(coords) {
  return coords[1] === this.nRenders;
}

export function hasRightNeighbour([col, row]) {
  return this.squares.includes([col + 1, row]);
}

export function hasTopNeighbour([col, row]) {
  return this.squares.includes([col, row - 1]);
}

export function includes(coord) {

  return this.squares.list
    .map(coords => coords.join(''))
    .includes(coord.join(''));
}

export function getClicked({ clientX, clientY }) {

  const { left, bottom } = this.canvas.face.domEl.getBoundingClientRect();

  return [
    clientX - left,
    -(clientY - bottom)
  ].map(coord => floor(coord / GameObject.size));
}
