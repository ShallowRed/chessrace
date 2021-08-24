import GameObject from 'app/components/Game-object';
import events from 'app/utils/event-emitter';
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
      canvas: document.querySelector('canvas')
    });

    this.setCanvasDimensions();
    this.setContainerDimensions();

    this.canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
      events.emit("SQUARE_CLICKED", this.getClickedSquare(clientX,
        clientY));
    });
  }

  reset() {
    this.nRenders = 0;
    this.translateY();
  }

  setCanvasDimensions() {
    this.canvas.width = columns * squareSize + shadowShift;
    this.canvas.height = visibleRows * squareSize + shadowShift;
    this.canvas.style.top = `-${squareSize}px`;
  }

  setContainerDimensions() {
    this.container.style.width = `${this.canvas.width}px`;
    this.container.style.height = `${this.canvas.height - squareSize}px`;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(squares) {
    this.clear();
    this.shadowOn();
    this.fillSquares(squares);
    this.shadowOff();
    this.fillSquares(squares);
    this.nRenders++;
  }

  fillSquares(squares) {
    squares.forEach(square => {
      this.fillSquare(square);
    });
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

  fillSquare([x, y]) {

    this.ctx.fillStyle = this.getSquareColor([x, y]);

    this.ctx.fillRect(
      x * squareSize,
      (visibleRows - y - 1) * squareSize,
      squareSize,
      squareSize
    );
  }

  getSquareColor([x, y]) {
    return [lightColor, darkColor][(x + y + this.nRenders) % 2];
  }

  getClickedSquare(clientX, clientY) {

    const { left, bottom } = this.canvas.getBoundingClientRect();

    return [
      floor((clientX - left) / squareSize),
      floor((bottom - clientY - shadowShift) / squareSize)
    ];
  }
}
