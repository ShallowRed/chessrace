import GameObject from 'app/components/Game-object';
import * as FinishingLine from 'app/components/Board/finishing-line';
import * as Squares from 'app/components/Board/squares';
import * as Draw from 'app/components/Board/draw';
import events from 'app/utils/event-emitter';
import { bindObjectsMethods, translateY } from "app/utils/utils";

export default class Board extends GameObject {

  nRenders = 0;

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
    });

    this.canvas2 = document.createElement("canvas");
    GameObject.container.append(this.canvas2);
    this.ctx2 = this.canvas2.getContext('2d');
    this.canvas2.style.zIndex = 900;
    this.canvas2.style.pointerEvents = "none";

    this.canvas3container = document.createElement("div");
    GameObject.container.append(this.canvas3container);
    this.canvas3container.style.overflow = "hidden";
    this.canvas3container.style.position = "absolute";

    this.canvas3 = document.createElement("canvas");
    this.ctx3 = this.canvas3.getContext('2d');
    this.canvas3.style.zIndex = 890;
    this.canvas3.style.pointerEvents = "none";
    this.canvas3container.append(this.canvas3);

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
      const { size, shadowShift, depth, container } = GameObject;

      canvas.style.top = `-${size + shadowShift}px`;
      canvas.style.left = 0;

      canvas.width = columns * size + shadowShift * 2;
      canvas.height = rows * size + shadowShift * 2;

      container.style.width = `${canvas.width}px`;
      container.style.height = `${canvas.height - shadowShift}px`;

      this.canvas2.style.top = `${(this.rows - 1) * size - 1}px`; // dirty fix
      this.canvas2.style.left = 0;
      this.canvas2.width = canvas.width;
      this.canvas2.height = shadowShift + size;

      this.canvas3container.style.top = `${(this.rows - 1) * size}px`;
      this.canvas3container.style.left = `${-1}px`;  // dirty fix
      this.canvas3container.style.width = `${canvas.width}px`;
      this.canvas3container.style.height = `${depth}px`;

      this.canvas3.style.bottom = 0;
      this.canvas3.style.left = 0;
      this.canvas3.width = canvas.width;
      this.canvas3.height = depth + size;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx2.clearRect(0, 0, this.canvas2.width, this.canvas2.height);
    this.ctx3.clearRect(0, 0, this.canvas3.width, this.canvas3.height);
  }

  render({ regularSquares, lastRowRendered, rows }) {

    this.squares.list = regularSquares;

    if (lastRowRendered === rows) {
      this.finishingLine.render(lastRowRendered - 1)
    }

    this.ctx2.fillStyle = "white";
    this.ctx2.fillRect(0, GameObject.depth, this.canvas2.width, this.canvas2.height);

    // this.draw.setShadow.on();
    // this.squares.renderShadow();
    // this.squares.renderFirstRowBottom();
    // this.draw.setShadow.off();
    this.squares.render();
    this.squares.renderTrick();
    this.squares.renderFirstRowBottom();

    this.nRenders++;
  }

  translateOneSquareDown(duration) {

    const { size } = GameObject;

    translateY(this.canvas2, {
      distance: -size * this.nRenders,
      duration
    });

    translateY(this.canvas3container, {
      distance: -size * this.nRenders,
      duration
    });

    translateY(this.canvas3, {
      distance: size,
      duration
    });
  }

  translateOneSquareUp() {

    const { size } = GameObject;

    translateY(this.canvas, {
      distance: -size * this.nRenders
    });

    translateY(this.canvas3);

  }

  resetTranslation() {
    translateY(this.canvas);
    translateY(this.canvas2);
    translateY(this.canvas3);
    translateY(this.canvas3container);
  }
}
