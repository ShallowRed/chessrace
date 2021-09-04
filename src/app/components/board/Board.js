import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/canvas';
import * as FinishingLine from 'app/components/Board/finishing-line';
import * as Squares from 'app/components/Board/squares';
import * as Draw from 'app/components/Board/draw';
import events from 'app/utils/event-emitter';
import { bindObjectsMethods } from "app/utils/utils";

export default class Board {

  nRenders = 0;
  canvas = {};
  ctx = {};

  squareColors = {
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
  };

  arrivalColors = {
    light: "#f0f0f0",
    dark: "#333",
    right: "#BBB",
    bottom: "#999",
  };

  methodsToBind = {
    draw: Draw,
    squares: Squares,
    finishingLine: FinishingLine
  };

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, this.methodsToBind);

    ["main", "boardBottom", "trick"].forEach(this.createCanvas);

    this.canvas.main.onClick(this.emitSquareClickedEvent);

    this.setDimensions();
  }

  createCanvas = (className) => {

    this.canvas[className] = new Canvas({
      className,
      isInContainer: className === "trick"
    });

    this.ctx[className] = this.canvas[className].ctx;
  }

  emitSquareClickedEvent = evt => {
    events.emit("SQUARE_CLICKED", this.squares.getClicked(evt));
  }

  setDimensions() {

    const { canvas, columns, rows } = this;
    const { size, shadowShift, depth, container } = GameObject;

    const width = columns * size + shadowShift * 2;
    const height = rows * size + shadowShift;

    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.top = `${depth}px`;

    canvas.main.setStyle({
      width,
      height: height + depth,
      bottom: size + depth * 2 + 1
    });

    canvas.boardBottom.setStyle({
      width,
      height: size + shadowShift,
      bottom: 0
    });

    canvas.trick.container.setStyle({
      width,
      height: depth,
      bottom: size + shadowShift - depth
    });

    canvas.trick.setStyle({
      width,
      height: depth + size,
      bottom: 0
    });
  }

  render({ regularSquares, lastRowRendered, rows }) {

    const { squares, ctx, canvas } = this;

    squares.list = regularSquares;

    if (lastRowRendered === rows) {
      this.finishingLine.render(ctx.main, lastRowRendered - 1)
    }

    ctx.boardBottom.fillStyle = "white";
    ctx.boardBottom.fillRect(0,
      GameObject.depth, canvas.boardBottom.width,
      canvas.boardBottom.height);

    // this.draw.setShadow.on(ctx.main);
    // this.draw.setShadow.on(ctx.boardBottom);
    // squares.renderShadow(ctx.main);
    // squares.renderBoardBottom(ctx.boardBottom);
    // this.draw.setShadow.off(ctx.main);
    // this.draw.setShadow.off(ctx.boardBottom);
    squares.render(ctx.main);
    squares.renderTrick(ctx.trick);
    squares.renderBoardBottom(ctx.boardBottom);

    this.nRenders++;
  }

  clear() {

    const { ctx, canvas } = this;

    for (const name in this.canvas) {

      ctx[name].clearRect(0, 0, canvas[name].width, canvas[name].height);
    }
  }
}
