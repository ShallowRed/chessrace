import GameObject from 'app/components/Game-object';

const { floor } = Math;

export function isLightSquare([col, row]) {
  return (col + row) % 2
}
export function isDarkSquare([col, row]) {
  return (col + row + 1) % 2
}

export function render2() {

  const { depth, size, offset } = GameObject;

  const visibleSquares = this.squares.list
    .filter(this.squares.isInVisibleRow);

  // Shadows
  this.squares.renderShadows(visibleSquares);

  const lightSquares = visibleSquares.filter(this.squares.isLightSquare);
  const darkSquares = visibleSquares.filter(this.squares.isDarkSquare);

  // Front faces
  this.ctx.frontFace.fillStyle = this.colors.squares.light.frontFace;
  this.ctx.frontFace.setColor("light");
  this.squares.renderFrontSquares(lightSquares);
  this.ctx.frontFace.setColor("dark");
  this.squares.renderFrontSquares(darkSquares);

  // Right faces
  this.ctx.rightFaces.setColor("light");
  this.squares.renderRightSquares(lightSquares);
  this.ctx.rightFaces.setColor("dark");
  this.squares.renderRightSquares(darkSquares);

  // Bottom faces
  this.ctx.bottomFaces.setColor("light");
  this.squares.renderBottomSquares(lightSquares);
  this.ctx.bottomFaces.setColor("dark");
  this.squares.renderBottomSquares(darkSquares);


  // Bottom row
  this.ctx.lowestBottomFace.setColor("light");
  this.squares.renderBottomFaceSquares(lightSquares);
  this.ctx.lowestBottomFace.setColor("dark");
  this.squares.renderBottomFaceSquares(darkSquares);
}

export function renderShadows(squares) {

  const { size, depth, offset } = GameObject;

  squares.forEach(square => {
    const left = this.squares.getLeft(square);
    const top = this.squares.getTop(square);
    this.canvas.shadows.draw.square({
      left: left - this.canvas.shadows.width + depth,
      top: top - offset.shadow - this.canvas.shadows.height
    });
  });
}

export function renderFrontSquares(squares) {

  squares.forEach(square => {
    const left = this.squares.getLeft(square);
    const top = this.squares.getTop(square);
    this.canvas.frontFace.draw.square({ left, top });
  });
}

export function renderRightSquares(squares) {

  const { size, depth } = GameObject;

  squares
    .filter(this.squares.hasNoRightNeighbour)
    .forEach(square => {

      const left = this.squares.getLeft(square);
      const top = this.squares.getTop(square);

      this.canvas.rightFaces.draw.rightFace({
        left: left + size,
        top: top - depth
      });
    });
}

export function renderBottomFaceSquares(squares) {

  const { size, depth } = GameObject;

  squares
    .filter(this.squares.isInBottomRow)
    .forEach(square => {
      const left = this.squares.getLeft(square);
      const top = this.squares.getTop(square);
      this.canvas.lowestBottomFace.draw.bottomFace({ left });
    });
}

export function renderBottomSquares(squares) {

  const { size, depth } = GameObject;

  squares
    .filter(this.squares.isNotInBottomRow)
    .filter(this.squares.hasNoTopNeighbour)
    .forEach(square => {
      const left = this.squares.getLeft(square);
      const top = this.squares.getTop(square);
      this.canvas.bottomFaces.draw.bottomFace({
        left,
        top: top + size - depth
      });
    });
}


export function render() {

  const { depth, size, offset } = GameObject;

  const length = this.squares.list.length;

  for (var i = 0; i < length; i++) {
    const square = this.squares.list[i];

      const left = this.squares.getLeft(square);
      const top = this.squares.getTop(square);

      this.canvas.shadows.draw.square({
        left: left - this.canvas.shadows.width + depth,
        top: top - offset.shadow - this.canvas.shadows.height
      });

      this.ctx.frontFace.fillStyle = this.squares.getColor(square,
        "frontFace");
      this.canvas.frontFace.draw.square({ left, top });

      if (!this.squares.hasRightNeighbour(square)) {

        this.ctx.rightFaces.fillStyle = this.squares.getColor(square,
          "rightFaces");
        this.canvas.rightFaces.draw.rightFace({
          left: left + size,
          top: top - depth
        });
      }

      if (this.squares.isInBottomRow(square)) {

        this.ctx.lowestBottomFace.fillStyle =
          this.squares.getColor(square, "bottomFaces");

        this.canvas.lowestBottomFace.draw.bottomFace({ left });

      } else if (!this.squares.hasTopNeighbour(square)) {

        this.ctx.bottomFaces.fillStyle = this.squares.getColor(square,
          "bottomFaces");
        this.canvas.bottomFaces.draw.bottomFace({
          left,
          top: top + size - depth
        });
      }
  };
}

export function getTop(coord) {

  const row = coord.length ? coord[1] : coord;

  const { size } = GameObject;

  const bottom = (row + 1 - this.nRenders) * size;

  return this.canvas.frontFace.height - bottom;
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

export function isNotInBottomRow(coords) {
  return coords[1] !== this.nRenders;
}

export function isInBottomRow(coords) {
  return coords[1] === this.nRenders;
}

export function hasNoRightNeighbour([col, row]) {
  return !this.squares.includes([col + 1, row]);
}

export function hasTopNeighbour([col, row]) {
  return this.squares.includes([col, row - 1]);
}
export function hasRightNeighbour([col, row]) {
  return this.squares.includes([col + 1, row]);
}

export function hasNoTopNeighbour([col, row]) {
  return !this.squares.includes([col, row - 1]);
}

export function includes(coord) {

  return this.squares.list
    .map(coords => coords.join(''))
    .includes(coord.join(''));
}

export function getClicked({ clientX, clientY }) {

  const { left, bottom } = this.canvas.frontFace.domEl
    .getBoundingClientRect();

  return [
    clientX - left,
    -(clientY - bottom)
  ].map(coord => floor(coord / GameObject.size));
}
