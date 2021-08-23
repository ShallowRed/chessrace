import { getSquaresOnTrajectory } from 'app/utils/pieces';
import { generateMapBlueprint } from 'app/utils/map-generator';
import events from 'app/utils/event-emitter';
import { Ennemies } from 'app/components/ennemies';

export default class Map {

  columns = 8;
  rows = 12;
  nRenders = 0;

  darkColor = "#ae835a";
  darkShadow = "#654321";
  lightColor = "#f5dbc2";
  lightShadow = "#825e3a";

  canvas = document.getElementById('board');
  container = this.canvas.parentNode;
  ctx = this.canvas.getContext('2d');

  squareSize = Math.ceil(Math.min(window.innerWidth * 0.5, 500) / this.columns);
  shadowShift = Math.round(this.squareSize / 4);

  constructor() {

    this.blueprint = generateMapBlueprint();

    this.canvas.width = this.columns * this.squareSize + this.shadowShift;
    this.canvas.height = this.rows * this.squareSize + this.shadowShift;
    this.canvas.style.top = `-${this.squareSize}px`;

    this.container.style.width = `${this.canvas.width}px`;
    this.container.style.height = `${this.canvas.height - this.squareSize}px`;

    this.setModel();
    this.render();
    console.log(this);
  }

  setModel() {
    this.model = this.blueprint.map(row => ([...row]));
  }

  reset() {
    this.nRenders = 0;
    this.translateY();
    this.clear();
    this.setModel();
    this.render();
  }

  render() {

    const regularSquares = [];

    this.model.forEach((row, i) => {

      row.forEach((square, j) => {

        if (square) {
          regularSquares.push([j + 1, i + 1 - this.nRenders]);
        }

        if (
          this.nRenders == 0 &&
          typeof square == "string"
        ) {
          Ennemies.add(square, [j + 1, i + 1], this)
        }
      });
    });

    this.ctx.shadowBlur = this.shadowShift / 2;
    this.ctx.shadowOffsetX = this.shadowShift / 4;
    this.ctx.shadowOffsetY = this.shadowShift / 4;
    this.ctx.shadowColor = "lightgrey";

    regularSquares.forEach(square => {
      this.fillSquare(square);
    });

    this.ctx.shadowColor = "transparent";

    regularSquares.forEach(square => {
      this.fillSquare(square);
    });

    this.nRenders++;
  }

  fillSquare([x, y], color) {

    this.ctx.fillStyle = color ||
      this.getSquareColor([x, y]);

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

  renderDownSquare([x, y], blur) {

    const { ctx } = this;

    ctx.shadowColor = this.darkShadow;
    ctx.shadowBlur = 2;

    ctx.shadowOffsetX = -blur;
    ctx.shadowOffsetY = -this.squareSize / 2 + 1;
    this.fillSquare([x + 1, y + 1]);
    ctx.shadowOffsetY = this.squareSize / 2;
    this.fillSquare([x + 1, y + 1]);

    ctx.shadowOffsetY = blur;
    ctx.shadowOffsetX = -this.squareSize / 2 + 1;
    this.fillSquare([x, y + 2]);
    ctx.shadowOffsetX = this.squareSize / 2;
    this.fillSquare([x, y + 2]);

    ctx.shadowColor = 'transparent';
    this.fillSquare([x, y]);
    this.fillSquare([x + 1, y]);
    this.fillSquare([x - 1, y + 1]);
    this.fillSquare([x + 1, y + 1]);
    this.fillSquare([x, y + 2]);
    this.fillSquare([x + 1, y + 2]);
    this.fillSquare([x - 1, y + 2]);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  translateY(distance = 0, duration = 0) {
    this.canvas.style.transitionDuration = `${duration}s`;
    this.canvas.style.transform = `translateY(${distance}px)`;
  }

  resetTranslation() {
    this.translateY();
  }

  getClickedSquare(clientX, clientY) {

    const { left, bottom } = this.canvas.getBoundingClientRect();

    return [
      Math.ceil((clientX - left) / this.squareSize),
      Math.ceil((bottom - clientY) / this.squareSize)
    ];
  }

  getModelIndex([x, y]) {
    return [
      x - 1,
      y + this.nRenders - 2
    ];
  }

  getModelValue(square) {
    const [i, j] = this.getModelIndex(square);
    return this.model[j]?.[i];
  }

  isHole(square) {
    return this.getModelValue(square) === 0;
  }

  isEnnemy(square) {
    return typeof this.getModelValue(square) === "string";
  }

  removeEnemy(square) {
    const [i, j] = this.getModelIndex(square);
    this.model[j][i] = 1;
  }

  getFirstObstacleOnTrajectory(position, targetSquare) {

    const coords = getSquaresOnTrajectory(position, targetSquare)
      .find(square =>
        this.isHole(square) ||
        this.isEnnemy(square)
      );

    if (coords) return {
      coords,
      isHole: this.getModelValue(coords) === 0
    }
  }
}
