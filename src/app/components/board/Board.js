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

    ["main", "trick", "bottomFace"].forEach(this.createCanvas);

    this.canvas.main.onClick(this.emitSquareClickedEvent);

    this.setDimensions();
  }

  createCanvas = (className) => {

    this.canvas[className] = new Canvas({
      className,
      inContainer: className === "trick" || className === "main"
    });

    this.ctx[className] = this.canvas[className].ctx;
  }

  emitSquareClickedEvent = evt => {
    events.emit("SQUARE_CLICKED", this.squares.getClicked(evt));
  }

  setDimensions() {

    const { canvas, columns, rows } = this;
    const { size, depth, offset, container } = GameObject;

    const width = columns * size + offset.shadow * 2;
    const height = (rows - 1) * size + offset.bottom;

    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.top = `${depth}px`;


    canvas.main.container.domEl.style.overflow = "hidden";

    canvas.main.container.setStyle({
      width,
      height: height - size,
      bottom: size
    });

    canvas.main.setStyle({
      width,
      height,
      bottom: 0
    });

    canvas.bottomFace.setStyle({
      width,
      height: offset.bottom,
      bottom: 0
    });

    canvas.trick.container.setStyle({
      width,
      height: depth + offset.shadow,
      bottom: offset.bottom - depth - offset.shadow - 1
    });

    canvas.trick.setStyle({
      width,
      height: size + depth + offset.shadow,
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
