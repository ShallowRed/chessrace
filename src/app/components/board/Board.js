import GameObject from 'app/components/Game-object';
import * as FinishingLine from 'app/components/Board/finishing-line';
import * as Squares from 'app/components/Board/squares';
import * as Draw from 'app/components/Board/draw';
import events from 'app/utils/event-emitter';
import { bindObjectsMethods, translateY } from "app/utils/utils";

export default class Board extends GameObject {

  nRenders = 0;
  depth = 10;

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

  ctx = this.canvas.getContext('2d');

  constructor(columns, rows) {

    super({
      canvas: document.createElement('canvas')
    });

    this.assign({ columns, rows });

    bindObjectsMethods.call(this, {
      draw: Draw,
      squares: Squares,
      finishingLine: FinishingLine
    })

    this.setDimensions();

    this.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.squares.getClicked(evt));
    });
  }

  reset() {
    this.nRenders = 0;
    this.resetTranslation();
    this.clear();
  }

  setDimensions() {

    const { canvas, columns, rows } = this;
    const { squareSize, shadowShift, container } = GameObject;

    canvas.style.top = `-${squareSize + shadowShift}px`;
    canvas.style.left = `${shadowShift}px`;

    canvas.width = columns * squareSize + shadowShift;
    canvas.height = rows * squareSize + shadowShift * 2;

    container.style.width = `${canvas.width + shadowShift + squareSize}px`;
    container.style.height =
    `${canvas.height - shadowShift}px`;

    this.testcanvas = document.querySelector("#test");
    this.testctx =   this.testcanvas.getContext('2d');
    this.testcanvas.style.zIndex = 900;
    this.testcanvas.style.bottom = `${0}px`;
    this.testcanvas.style.left = `${shadowShift}px`;
    this.testcanvas.width = canvas.width;
    this.testcanvas.height = shadowShift + squareSize;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render({ regularSquares, lastRowRendered, rows }) {

    this.squares.list = regularSquares;

    if (lastRowRendered === rows) {
      this.finishingLine.render(lastRowRendered - 1)
    }

    this.testctx.clearRect(0, 0, this.testcanvas.width, this.testcanvas.height);
    this.testctx.fillStyle = "white";
    // this.testctx.fillStyle = "red";
    this.testctx.fillRect(0, 0, this.depth, this.depth);
    this.testctx.fillRect(0, this.depth, this.testcanvas.width, this.testcanvas.height);

    this.draw.setShadow.on();
    this.squares.renderShadow();
    this.squares.drawTest();
    this.draw.setShadow.off();
    this.squares.drawTest();
    this.squares.render();


    this.nRenders++;
  }

  translateOneSquareUp() {
    translateY(this.canvas, {
      distance: -GameObject.squareSize * this.nRenders
    })
  }

  resetTranslation() {
    translateY(this.canvas);
    translateY(this.testcanvas);
  }
}
