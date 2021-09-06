import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/Canvas';

import * as Draw from 'app/components/Board/draw';
import * as Squares from 'app/components/Board/squares';
import * as FinishingLine from 'app/components/Board/finishing-line';

import events from 'app/models/events';
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Board {

  nRenders = 0;
  canvas = {};
  ctx = {};

  colors = {

    squares: {
      dark: {
        face: "#ae835a",
        right: "#8b6848",
        bottom: "#6f5339",
      },
      light: {
        face: "#f5dbc2",
        right: "#c4af9b",
        bottom: "#9c8c7c",
      }
    },
    finishingLine: {
      light: "#f0f0f0",
      dark: "#333",
      right: "#BBB",
      bottom: "#999",
    },

    shadow: "#EEE"
  };

  methodsToBind = {
    draw: Draw,
    squares: Squares,
    finishingLine: FinishingLine
  };

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, this.methodsToBind);

    ["shadows", "bottom", "right", "face", "bottomFace"].forEach(this.createCanvas);

    this.canvas.face.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.squares.getClicked(evt))
    });

    this.setDimensions();
  }

  createCanvas = (className) => {

    this.canvas[className] = new Canvas({
      className,
      inContainer: className !== "bottomFace"
    });

    this.ctx[className] = this.canvas[className].ctx;
  }

  setDimensions() {

    const { canvas, ctx, columns, rows } = this;
    const { size, depth, offset, container } = GameObject;

    const width = columns * size;
    const height = (rows) * size + depth;

    container.style.width = `${width + depth + offset.shadow}px`;
    container.style.height = `${height}px`;
    container.style.top = `${depth}px`;

    canvas.face.container.setStyle({
      width,
      height: height - size - depth,
      bottom: size + depth
    });

    canvas.face.setStyle({
      width,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.shadows.container.setStyle({
      width: width + depth + offset.shadow,
      height: height - size + offset.shadow,
      bottom: size - offset.shadow
    });

    canvas.shadows.setStyle({
      width: width + depth + offset.shadow,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.right.container.setStyle({
      width: width + depth,
      height: height - size,
      bottom: size
    });

    canvas.right.setStyle({
      width: width + depth,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.bottom.container.setStyle({
      width: width + depth,
      height: height - size,
      bottom: size
    });

    canvas.bottom.setStyle({
      width: width + depth,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.bottomFace.setStyle({
      width: width + depth,
      height: depth,
      bottom: size
    });

    ctx.shadows.fillStyle = "white";
    ctx.shadows.shadowColor = this.colors.shadow;
    ctx.shadows.shadowOffsetX = offset.shadow + canvas.shadows.width;
    ctx.shadows.shadowOffsetY = offset.shadow + canvas.shadows.height;
  }

  render({ regularSquares, lastRowRendered, rows }) {

    this.squares.list = regularSquares;

    if (lastRowRendered === rows) {
      this.finishingLine.render(lastRowRendered - 1)
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
