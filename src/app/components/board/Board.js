import events from 'app/models/events';

import GameObject from 'app/components/Game-object';
import PlayArea from 'app/models/play-area';

import CanvasCollection from 'app/models/canvas-collection';

import { canvasConfig, colors } from 'app/components/Board/board-config';

import Square from 'app/components/Board/Square';
import * as RenderSquares from 'app/components/Board/render-squares';
import * as RenderFinishLine from 'app/components/Board/render-finishing-line';
import * as RenderInput from 'app/components/Board/render-input';

import { setStyle } from "app/utils/set-style";
import { bindObjectsMethods } from "app/utils/bind-methods";
// import { test } from "app/utils/test";

export default class Board {

  nRenders = 0;

  constructor(columns, rows) {

    Object.assign(
      this, { columns, rows, colors },
      new CanvasCollection(canvasConfig)
    );

    bindObjectsMethods.call(this, {
      square: Square,
      squares: RenderSquares,
      finishLine: RenderFinishLine,
      input: RenderInput,
    });

    this.canvas.frontFaces.onClick(evt => {

      events.emit("SQUARE_CLICKED", this.square.get.clicked(evt));
    });

    this.testinit();
  }

  setDimensions() {

    const { width, height, offset, size, input } = PlayArea;

    setStyle(GameObject.container, {
      top: 5,
      left: Math.round((window.innerWidth - width) / 2.7),
      width: width + offset.thickness + offset.left * 2,
      height: height + size + offset.top,
    });

    for (const canvas of this.canvas.collection) {
      const { left, ...dimensions } = canvas.getDimensions(PlayArea);

      canvas.setStyle({
        ...dimensions,
        left: !canvas.container && left || 0
      });

      canvas.container?.setStyle({
        left,
        width: canvas.width,
        top: offset.top,
        height: canvas.height - size
      });
    }

    this.ctx.shadows.fillStyle = this.colors.shadow;

    this.input.render();
  }

  render(model, { resize = false } = {}) {

    if (!resize) {

      this.nRenders++;
    }

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
