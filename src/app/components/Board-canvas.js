import GameObject from 'app/components/Game-object';
import events from 'app/utils/event-emitter';
import { translateY } from "app/utils/utils";

const { floor, round } = Math;

export default class BoardCanvas extends GameObject {

  ctx = this.canvas.getContext('2d');
  darkColor = "#ae835a";
  lightColor = "#f5dbc2";
  nRenders = 0;

  constructor(columns, rows) {

    super({
      canvas: document.createElement('canvas')
    });

    this.columns = columns;
    this.rows = rows;

    this.setDimensions();

    this.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.getClickedSquare(evt));
    });

    // this.laser = new GameObject({
    //   laser: document.createElement('div')
    // })
    //
    // this.laser.domEl.className = "laser";
    // this.laser.domEl.style.width = `${this.canvas.width - shadowShift}px`;
    // this.laser.domEl.style.bottom = `${(squareSize * 1.1) + shadowShift}px`;
  }

  setDimensions() {

    const { squareSize, shadowShift, container } = GameObject;

    this.canvas.style.top = `-${squareSize}px`;

    this.canvas.width = this.columns * squareSize + shadowShift;
    this.canvas.height = this.rows * squareSize + shadowShift;

    container.style.width = `${this.canvas.width}px`;
    container.style.height = `${this.canvas.height - squareSize}px`;
  }

  render(squares = this.regularSquares) {

    this.regularSquares = squares;

    translateY(this.canvas, {
      distance: -GameObject.squareSize * this.nRenders,
      duration: 0
    });

    this.clear();
    this.shadowOn();
    this.fillSquares(squares);
    this.shadowOff();
    this.fillSquares(squares);

    this.nRenders++;
  }

  renderEnd(row) {

    this.ctx.fillStyle =
    this.ctx.strokeStyle = "#333";

    const squareSize = floor(GameObject.squareSize / 5);
    const nSquare = floor((this.canvas.width - GameObject.shadowShift) /
      squareSize);

    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < nSquare; i += 2) {
        this.ctx.fillRect(
          (i + j % 2) * squareSize,
          GameObject.squareSize * (this.rows - row - 1 + this.nRenders) -
          (j + 1) * squareSize - 5,
          squareSize,
          squareSize
        );
      }
    }

  }

  reset() {
    this.nRenders = 0;
    translateY(this.canvas, { duration: 0, distance: 0 });
    translateY(GameObject.container, { duration: 0, distance: 0 });
    // translateY(this.laser.domEl, { duration: 0, distance: 0 });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  fillSquares(squares) {
    squares.forEach(square => {
      this.fillSquare(
        square,
        GameObject.squareSize,
        this.getSquareColor(square)
      );
    });
  }

  fillSquare([x, y], squareSize, color) {

    this.ctx.fillStyle = color;

    this.ctx.fillRect(
      squareSize * x,
      squareSize * (this.rows - y - 1 + this.nRenders),
      squareSize,
      squareSize
    );
  }

  getSquareColor([x, y]) {
    return [this.lightColor, this.darkColor][(x + y) % 2];
  }

  shadowOn() {

    const { shadowShift } = GameObject;

    this.ctx.shadowColor = "lightgrey";
    this.ctx.shadowBlur = shadowShift / 2;
    this.ctx.shadowOffsetX = shadowShift / 4;
    this.ctx.shadowOffsetY = shadowShift / 4;
  }

  shadowOff() {
    this.ctx.shadowColor = "transparent";
  }

  getClickedSquare({ clientX, clientY }) {

    const { squareSize, shadowShift } = GameObject;
    const { left, bottom } = this.canvas.getBoundingClientRect();

    return [
      floor((clientX - left) / squareSize),
      floor((bottom - clientY - shadowShift) / squareSize)
    ];
  }
}
