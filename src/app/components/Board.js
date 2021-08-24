import GameObject from 'app/components/Game-object';
import events from 'app/utils/event-emitter';
import { generateMapBlueprint } from 'app/utils/map-generator';
import {
  squareSize,
  shadowShift,
  columns,
  visibleRows,
  boardRows,
  darkColor,
  lightColor
} from "app/config";

const { abs, ceil, sign, max } = Math;

export default class Board extends GameObject {

  ctx = this.canvas.getContext('2d');

  blueprint = generateMapBlueprint();

  constructor() {

    super({
      canvas: document.querySelector('canvas')
    });

    this.setCanvasDimensions();
    this.setContainerDimensions();
    this.reset();
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

  reset() {
    this.nRenders = 0;
    this.clear();
    this.setModel();
    this.render();
    this.translateY();
  }

  setModel() {
    this.model = this.blueprint.map(row => ([...row]));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {

    const regularSquares = [];

    this.forEachModelValue((value, coords, isPiece) => {

      if (value) {
        regularSquares.push(coords);
      }

      if (this.nRenders == 0 && isPiece) {
        events.emit("NEW_ENNEMY", value, coords)
      }
    });

    this.shadowOn();
    this.fillSquares(regularSquares);
    this.shadowOff();
    this.fillSquares(regularSquares);

    this.nRenders++;
  }

  forEachModelValue(callback) {

    for (let i = 0; i < boardRows; i++) {
      for (let j = 0; j < columns; j++) {

        const value = this.model[i][j];
        const coords = this.getCoords([i, j]);

        callback(value, coords, typeof value == "string");
      }
    }
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
      (x - 1) * squareSize,
      (visibleRows - y) * squareSize,
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
      ceil((clientX - left) / squareSize),
      ceil((bottom - clientY - shadowShift) / squareSize)
    ];
  }

  getCoords([i, j]) {
    return [
      j + 1,
      i + 1 - this.nRenders
    ];
  }

  getModelIndex([x, y]) {
    return [
      x - 1,
      y - 2 + this.nRenders
    ];
  }

  getModelValue(square) {
    const [i, j] = this.getModelIndex(square);
    return this.model[j]?.[i];
  }

  setModelValue(square, value) {
    const [i, j] = this.getModelIndex(square);
    return this.model[j][i] = value;
  }

  removeEnemy(square) {
    this.setModelValue(square, 1)
  }

  isHole(square) {
    return !this.getModelValue(square);
  }

  isEnnemy(square) {
    return typeof this.getModelValue(square) === "string";
  }

  getFirstObstacleOnTrajectory(position, targetSquare) {

    const isObstacle = square =>
      this.isHole(square) || this.isEnnemy(square)

    const firstObstacle =
      this.getSquaresOnTrajectory(position, targetSquare)
      .find(isObstacle);

    if (firstObstacle) return {
      coords: firstObstacle,
      isHole: this.isHole(firstObstacle)
    }
  }

  getSquaresOnTrajectory([x, y], [tx, ty]) {

    const deltaLength = max(
      abs(tx - x),
      abs(ty - y)
    );

    const getSquareOnTrajectory = (e, i) => ([
      x + sign(tx - x) * (i + 1),
      y + sign(ty - y) * (i + 1)
    ]);

    return new Array(deltaLength - 1)
      .fill()
      .map(getSquareOnTrajectory)
  }
}
