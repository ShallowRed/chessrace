import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/Canvas';

import * as Squares from 'app/components/Board/squares';
import * as FinishLine from 'app/components/Board/finishing-line';

import events from 'app/models/events';
import { bindObjectsMethods } from "app/utils/bind-methods";

import { test } from "app/utils/test";

export default class Board {

  nRenders = 0;
  canvas = {};
  ctx = {};

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

  createParts() {

    ["shadows", "bottomFaces", "rightFaces", "frontFace", "lowestBottomFace"]
    .forEach(this.createCanvas);

    this.canvas.frontFace.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.squares.getClicked(evt))
    });
  }

  createCanvas = key => {

    this.canvas[key] = new Canvas({
      colors: this.colors,
      key,
      inContainer: key !== "lowestBottomFace"
    });

    this.ctx[key] = this.canvas[key].ctx;
  }

  setDimensions() {

    const { canvas, ctx, columns, rows } = this;
    const { size, depth, offset, container } = GameObject;

    const width = columns * size;
    const height = (rows) * size + depth;

    container.style.width = `${width + depth + offset.shadow}px`;
    container.style.height = `${height}px`;
    container.style.top = `${depth}px`;

    canvas.frontFace.container.setStyle({
      width,
      height: height - size - depth,
      bottom: size + depth
    });

    canvas.frontFace.setStyle({
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

    canvas.rightFaces.container.setStyle({
      width: width + depth,
      height: height - size,
      bottom: size
    });

    canvas.rightFaces.setStyle({
      width: width + depth,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.bottomFaces.container.setStyle({
      width: width + depth,
      height: height - size,
      bottom: size
    });

    canvas.bottomFaces.setStyle({
      width: width + depth,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.lowestBottomFace.setStyle({
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
      this.finishLine.render(lastRowRendered)
    }

    console.log("old");
    test(this.squares.render, 1);
    console.log("new");
    test(this.squares.render2, 1);

    // this.squares.render();

    this.nRenders++;
  }

  clear() {

    const { ctx, canvas } = this;

    for (const name in this.canvas) {

      if (ctx[name]) {

        ctx[name].clearRect(0, 0, canvas[name].width, canvas[name].height);
      }
    }
  }
}
