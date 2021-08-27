import GameObject from 'app/components/Game-object';
import events from 'app/utils/event-emitter';
import { translateY } from "app/utils/utils";
import {
  squareSize,
  shadowShift,
  columns,
  visibleRows,
  darkColor,
  lightColor
} from "app/config";

const { floor } = Math;

export default class BoardCanvas extends GameObject {

  ctx = this.canvas.getContext('2d');

  constructor() {

    super({
      canvas: document.createElement('canvas')
    });

    this.canvas.style.top = `-${squareSize}px`;

    this.canvas.width = columns * squareSize + shadowShift;
    this.canvas.height = visibleRows * squareSize + shadowShift;

    this.container.style.width =
      `${this.canvas.width}px`;

    this.container.style.height =
      `${this.canvas.height - squareSize}px`;

    this.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.getClickedSquare(evt));
    });
  }

  render(squares) {

    translateY(this.canvas, {
      duration: 0,
      distance: -squareSize * this.nRenders
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
    translateY(this.container, { duration: 0, distance: 0 });
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

    this.ctx.fillRect(
      squareSize * x,
      squareSize * (visibleRows - y - 1 + this.nRenders),
      squareSize,
      squareSize
    );
  }

  getSquareColor([x, y]) {
    return [lightColor, darkColor][(x + y) % 2];
  }

  shadowOn() {
    this.ctx.shadowColor = "lightgrey";
    this.ctx.shadowBlur = shadowShift / 2;
    this.ctx.shadowOffsetX = shadowShift / 4;
    this.ctx.shadowOffsetY = shadowShift / 4;
  }

  shadowOff() {
    this.ctx.shadowColor = "transparent";
  }

  getClickedSquare({ clientX, clientY }) {

    const { left, bottom } = this.canvas.getBoundingClientRect();

    return [
      floor((clientX - left) / squareSize),
      floor((bottom - clientY - shadowShift) / squareSize)
    ];
  }
}
