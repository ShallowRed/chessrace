import GameObject from 'app/components/Game-object';
import events from 'app/utils/event-emitter';
import { translateY } from "app/utils/utils";
import { columns, rows } from "app/config";

const { floor } = Math;

export default class BoardCanvas extends GameObject {

  ctx = this.canvas.getContext('2d');
  darkColor = "#ae835a";
  lightColor = "#f5dbc2";

  constructor() {

    super({
      canvas: document.createElement('canvas')
    });

    const { squareSize, shadowShift, container } = GameObject;

    this.canvas.style.top = `-${squareSize}px`;

    this.canvas.width = columns * squareSize + shadowShift;
    this.canvas.height = rows * squareSize + shadowShift;

    container.style.width =
      `${this.canvas.width}px`;

    container.style.height =
      `${this.canvas.height - squareSize}px`;

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

  render(squares) {

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
      this.fillSquare(square);
    });
  }

  fillSquare([x, y]) {

    this.ctx.fillStyle = this.getSquareColor([x, y]);

    const { squareSize } = GameObject;

    this.ctx.fillRect(
      squareSize * x,
      squareSize * (rows - y - 1 + this.nRenders),
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
