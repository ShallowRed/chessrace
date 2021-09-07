import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/Canvas';

import * as Squares from 'app/components/Board/squares';
import * as FinishLine from 'app/components/Board/finishing-line';

import events from 'app/models/events';
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Board {

  nRenders = 0;

  colors = {

    squares: {
      dark: {
        frontFace: "#ae835a",
        rightFaces: "#8b6848",
        bottomFaces: "#6f5339",
        lowestBottomFace: "#6f5339",
      },
      light: {
        frontFace: "#f5dbc2",
        rightFaces: "#c4af9b",
        bottomFaces: "#9c8c7c",
        lowestBottomFace: "#9c8c7c",
      }
    },
    finishLine: {
      light: "#f0f0f0",
      dark: "#333",
      rightFaces: "#BBB",
      bottomFaces: "#999",
    },

    shadow: "#EEE"
  };

  methodsToBind = {
    squares: Squares,
    finishLine: FinishLine
  };

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, this.methodsToBind);

    this.createParts();

    this.setDimensions();
  }

  canvasProps = [{
    name: "shadows",
    shape: "square",
    squareColors: false,
  }, {
    name: "bottomFaces",
    shape: "bottomFace",
    filter: (squares) => {
      return squares
        .filter(this.squares.isNotInBottomRow)
        .filter(this.squares.hasNoTopNeighbour)
    }
  }, {
    name: "rightFaces",
    shape: "rightFace",
    filter: (squares) => {
      return squares.filter(this.squares.hasNoRightNeighbour)
    }
  }, {
    name: "frontFace",
    shape: "square",
  }, {
    name: "lowestBottomFace",
    shape: "bottomFace",
    translatable: false,
    filter: (squares) => {
      return squares.filter(this.squares.isInBottomRow)
    }
  }]

  createParts() {

    this.canvas = {};
    this.ctx = {};
    this.translatableCanvas = [];
    this.coloredCanvas = [];

    this.canvasProps.forEach(this.createCanvas);

    this.canvas.frontFace.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.squares.getClicked(evt))
    });
  }

  createCanvas = ({
    name,
    filter,
    shape,
    translatable = true,
    squareColors =
    true
  }) => {

    const canvas = new Canvas({
      colors: this.colors,
      inContainer: translatable,
      name,
      filter,
      shape,
      squareColors
    });

    this.canvas[name] = canvas;
    this.ctx[name] = this.canvas[name].ctx;

    if (translatable) {
      this.translatableCanvas.push(canvas);
    }

    if (squareColors) {
      this.coloredCanvas.push(canvas);
    }
  }

  setDimensions() {

    const { canvas, ctx, columns, rows } = this;
    const { size, depth, offset, container } = GameObject;

    const width = columns * size;
    const height = rows * size;

    container.style.width = `${width + depth + offset.shadow}px`;
    container.style.height = `${height + depth}px`;
    container.style.top = `${depth}px`;

    canvas.frontFace.container.setStyle({
      width,
      height: height - size,
      bottom: depth + size
    });

    canvas.rightFaces.container.setStyle({
      width: width + depth,
      height: height + depth - size,
      bottom: size
    });

    canvas.bottomFaces.container.setStyle({
      width: width + depth,
      height: height + depth - size,
      bottom: size
    });

    canvas.shadows.container.setStyle({
      width: width,
      height: height - size + depth + offset.shadow,
      bottom: size - offset.shadow,
      left: depth + offset.shadow
    });

    ////////////

    canvas.frontFace.setStyle({
      width,
      height
    });

    canvas.shadows.setStyle({
      width: width,
      height: height + depth + offset.shadow
    });

    canvas.rightFaces.setStyle({
      width: width + depth,
      height: height + depth
    });

    canvas.bottomFaces.setStyle({
      width: width + depth,
      height: height + depth
    });

    ////////////

    canvas.lowestBottomFace.setStyle({
      width: width + depth,
      height: depth,
      bottom: size
    });

    ctx.shadows.fillStyle = this.colors.shadow;
  }

  render({ regularSquares, lastRowRendered, rows }) {

    this.squares.list = regularSquares;

    if (lastRowRendered === rows) {
      this.finishLine.render(lastRowRendered)
    }

    this.squares.render();

    this.nRenders++;
  }

  clear() {

    const { ctx, canvas } = this;

    for (const name in this.canvas) {

      ctx[name].clearRect(0, 0, canvas[name].width, canvas[name].height);
    }
  }
}
