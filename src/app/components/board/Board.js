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
    isFlat: true,
    isColored: false,
  }, {
    name: "bottomFaces",
    shape: "bottomFace",
    filter: squares => squares
      .filter(this.squares.isNotInBottomRow)
      .filter(this.squares.hasNoTopNeighbour),
  }, {
    name: "rightFaces",
    shape: "rightFace",
    filter: squares =>
      squares.filter(this.squares.hasNoRightNeighbour),
  }, {
    name: "frontFace",
    shape: "square",
    isFlat: true,
  }, {
    name: "lowestBottomFace",
    shape: "lowestBottomFace",
    inContainer: false,
    filter: squares =>
      squares.filter(this.squares.isInBottomRow),
  }];

  createParts() {

    this.canvas = {};
    this.ctx = {};
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
    inContainer = true,
    isColored = true
  }) => {

    const canvas = new Canvas({
      inContainer,
      isColored,
      name,
      shape,
      filter
    });

    this.canvas[name] = canvas;
    this.ctx[name] = this.canvas[name].ctx;
  }

  setDimensions() {

    const { canvas, ctx, columns, rows } = this;
    const { size, depth, offset, container } = GameObject;

    const width = columns * size;
    const height = rows * size;

    container.style.width = `${width + depth + offset.shadow}px`;
    container.style.height = `${height + depth}px`;
    container.style.top = `${depth}px`;

    for (const name in this.canvas) {

      const canvas = this.canvas[name];

      const offsetHeight =
        name === "frontFace" ? -depth :
        name === "shadows" ? offset.shadow :
        0;

      canvas.setStyle({
        width: width + (!canvas.isFlat && depth),
        height: depth + (canvas.inContainer && height + offsetHeight),
        bottom: !canvas.inContainer && size
      });

      canvas.container?.setStyle({
        width: canvas.width,
        height: canvas.height - size,
        bottom: size - offsetHeight,
        left: !canvas.isColored && depth + offset.shadow
      });
    }

    this.ctx.shadows.fillStyle = this.colors.shadow;
  }

  render({ regularSquares, lastRowRendered, rows }) {

    this.squares.list = regularSquares;

    if (lastRowRendered === rows) {

      this.finishLine.render(lastRowRendered);
    }

    this.squares.render(this.squares.list);

    this.nRenders++;
  }

  clear() {

    const { ctx, canvas } = this;

    for (const name in this.canvas) {

      ctx[name].clearRect(0, 0, canvas[name].width, canvas[name]
        .height);
    }
  }
}
