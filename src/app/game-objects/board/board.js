import events from 'app/game-events/event-emitter';

import GameObject from 'app/game-objects/game-object';

import PlayArea from 'app/game-objects/board/models/play-area';
import CanvasCollections from 'app/game-objects/board/models/canvas-collection';
import Square from 'app/game-objects/board/models/square';

import Render from 'app/game-objects/board/render/';

import { canvasConfig, colors } from 'app/game-objects/board/board-config';

import { setStyle } from "app/utils/set-style";
import { bindObjectsMethods } from "app/utils/bind-methods";
// import { test } from "app/utils/test";

const { round } = Math;

export default class Board {

  nRenders = 0;

  constructor(columns, rows) {

    Object.assign( this, { columns, rows, colors },
      new CanvasCollections(canvasConfig)
    );

    bindObjectsMethods.call(this, { square: Square, ...Render });

    this.canvas.frontFaces.onClick(evt => {

      events.emit("CANVAS_CLICKED", evt);
    });

    // this.testinit();
  }

  setDimensions() {

    const { width, height, offset, squareSize } = PlayArea;

    const totalWidth = width + offset.thickness + offset.left * 2;

    setStyle(GameObject.container, {
      top: 5,
      left: round((window.innerWidth - totalWidth) / 2),
      width: totalWidth,
      height: height + squareSize + offset.top,
    });

    for (const canvas of this.canvas.collection) {

      const { left, ...dimensions } = canvas.getDimensions(PlayArea);

      canvas.setStyle({
        ...dimensions,
        left: !canvas.container && left || 0
      });

      canvas.setPixelRatio();

      canvas.container?.setStyle({
        left,
        width: canvas.width,
        top: offset.top,
        height: canvas.height - squareSize
      });
    }

    this.ctx.shadows.fillStyle = this.colors.shadow;

    this.input.render();
  }

  render(model) {

    if (model.lastRowRendered === model.rows - 1) {

      this.finishLine.render(model.rows);
    }

    this.squares.render(model.regularSquares);
  }

  clear() {

    for (const canvas of this.canvas.dynamicCollection) {

      canvas.clear();
    }
  }

  testinit() {

    this.test = new GameObject({
      domEl: document.createElement('div'),
      className: `test`
    });

    this.test.domEl.style.position = "absolute";
    this.test.domEl.style.bottom = "100%";
    this.test.domEl.style.left = "0";
    this.test.domEl.style.width = "100%";
    this.test.domEl.style.height = "120vh";
    this.test.domEl.style.zIndex = "700";
    this.test.domEl.style.background = "white";

  }

  dotest() {

    for (const canvas of [
        this.canvas.inputTop, this.canvas.inputBottom
      ]) {

      this.test.translateY({ rows: this.rows });
      canvas.translateY({ rows: this.rows });
    }

    setTimeout(() => {

      for (const canvas of [
          this.canvas.inputTop, this.canvas.inputBottom
        ]) {

        setTimeout(() => {
          this.test.translateY({ rows: 0, duration: 1 });
          canvas.translateY({ rows: 0, duration: 1 })
        })

      }
    }, 1000);
  }
}
