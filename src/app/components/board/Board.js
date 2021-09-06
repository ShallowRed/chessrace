import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/Canvas';

import * as Draw from 'app/components/Board/draw';
import * as BoardBottom from 'app/components/Board/bottom-face';
import * as Trick from 'app/components/Board/trick';
import * as Squares from 'app/components/Board/squares';
import * as Cubes from 'app/components/Board/cubes';
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
    }
  };

  methodsToBind = {
    draw: Draw,
    squares: Squares,
    cubes: Cubes,
    trick: Trick,
    bottomFace: BoardBottom,
    finishingLine: FinishingLine
  };

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, this.methodsToBind);

    ["main", "trick", "bottomFace", "trickShadow"].forEach(this.createCanvas);

    this.canvas.main.onClick(evt => {
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

    const { canvas, columns, rows } = this;
    const { size, depth, offset, container } = GameObject;

    const width = columns * size + depth + offset.shadow;
    const height = (rows) * size + depth;

    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.top = `${depth}px`;

    canvas.main.container.domEl.style.overflow = "hidden";
    canvas.trickShadow.container.domEl.style.overflow = "hidden";

    // canvas.trick.container.domEl.style.overflow = "visible";
    // canvas.bottomFace.domEl.style.display = "none";

    canvas.main.container.setStyle({
      width,
      height: height - size + offset.shadow,
      // height: height - size + offset.shadow - size,
      bottom: size - offset.shadow
      // top: 0
    });

    canvas.main.setStyle({
      width,
      height: height + offset.shadow,
      bottom: 0
    });

    canvas.bottomFace.setStyle({
      width,
      height: depth + offset.shadow,
      bottom: size - offset.shadow
    });

    canvas.trick.container.setStyle({
      width,
      height: depth + offset.shadow,
      bottom: size - offset.shadow
      // bottom: offset.bottom - depth - offset.shadow - 1
    });

    canvas.trick.setStyle({
      width,
      height: size + depth + offset.shadow,
      bottom: 0
    });

    canvas.trickShadow.container.setStyle({
      width,
      height:  offset.shadow,
      bottom: size - offset.shadow
      // bottom: offset.bottom - depth - offset.shadow - 1
    });

    canvas.trickShadow.setStyle({
      width,
      height: size + offset.shadow,
      bottom: 0
    });
  }

  render({ regularSquares, lastRowRendered, rows }) {

    this.squares.list = regularSquares;

    if (lastRowRendered === rows) {
      this.finishingLine.render(lastRowRendered - 1)
    }

    this.cubes.render();
    this.trick.render();
    this.bottomFace.render();

    this.nRenders++;
  }

  clear() {

    const { ctx, canvas } = this;

    for (const name in this.canvas) {

      ctx[name].clearRect(0, 0, canvas[name].width, canvas[name].height);
    }
  }
}
