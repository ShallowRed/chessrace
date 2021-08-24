import { generateMapBlueprint } from 'app/utils/map-generator';
import { Ennemies } from 'app/components/ennemies';
import GameObject from 'app/components/Game-object';

export default class Board extends GameObject {

  rows = 12;
  darkColor = "#ae835a";
  lightColor = "#f5dbc2";

  canvas = document.querySelector('canvas');
  ctx = this.canvas.getContext('2d');

  constructor() {

    super("canvas");

    this.blueprint = generateMapBlueprint();

    this.setCanvasDimensions();
    this.setContainerDimensions();
    this.reset();
  }

  setCanvasDimensions() {
    this.canvas.width = this.columns * this.squareSize + this.shadowShift;
    this.canvas.height = this.rows * this.squareSize + this.shadowShift;
    this.canvas.style.top = `-${this.squareSize}px`;
  }

  setContainerDimensions() {
    this.container.style.width = `${this.canvas.width}px`;
    this.container.style.height = `${this.canvas.height - this.squareSize}px`;
  }

  reset() {
    this.nRenders = 0;
    this.clear();
    this.setModel();
    this.render();
    this.resetTranslation();
  }

  setModel() {
    this.model = this.blueprint.map(row => ([...row]));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {

    const regularSquares = [];

    const renderModelValue = (value, coords, isPiece) => {

      if (value) {
        regularSquares.push(coords);
      }

      if (this.nRenders == 0 && isPiece) {
        Ennemies.add(value, coords)
      }
    }

    this.forEachModelValue(renderModelValue);

    this.shadowOn();
    this.fillSquares(regularSquares);
    this.shadowOff();
    this.fillSquares(regularSquares);

    this.nRenders++;
  }

  forEachModelValue(callback) {

    const modelRows = this.model.length;

    for (let i = 0; i < modelRows; i++) {
      for (let j = 0; j < this.columns; j++) {

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
    this.ctx.shadowBlur = this.shadowShift / 2;
    this.ctx.shadowOffsetX = this.shadowShift / 4;
    this.ctx.shadowOffsetY = this.shadowShift / 4;
  }

  shadowOff() {
    this.ctx.shadowColor = "transparent";
  }

  fillSquare([x, y]) {

    this.ctx.fillStyle = this.getSquareColor([x, y]);

    this.ctx.fillRect(
      (x - 1) * this.squareSize,
      (this.rows - y) * this.squareSize,
      this.squareSize,
      this.squareSize
    );
  }

  getSquareColor([x, y]) {
    return (x + y + this.nRenders) % 2 === 0 ?
      this.lightColor :
      this.darkColor;
  }

  getClickedSquare(clientX, clientY) {

    const { left, bottom } = this.canvas.getBoundingClientRect();

    return [
      Math.ceil((clientX - left) / this.squareSize),
      Math.ceil((bottom - clientY) / this.squareSize)
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

    const deltaLength = Math.max(
      Math.abs(tx - x),
      Math.abs(ty - y)
    );

    const getSquareOnTrajectory = (e, i) => ([
      x + Math.sign(tx - x) * (i + 1),
      y + Math.sign(ty - y) * (i + 1)
    ]);

    return new Array(deltaLength - 1)
      .fill()
      .map(getSquareOnTrajectory)
  }
}
