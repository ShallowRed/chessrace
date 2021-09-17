import events from 'app/models/events';

import GameObject from 'app/components/Game-object';

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
  }

  setDimensions() {

    const { playArea, depth, shadowOffset, size } = GameObject;

    setStyle(GameObject.container, {
      width: playArea.width + depth * 7,
      // width: playArea.width + depth + shadowOffset,
      height: playArea.height + depth + size * 2,
    });

    for (const canvas of this.canvas.collection) {
      const { left, ...dimensions } = canvas.getDimensions(GameObject);

      canvas.setStyle({
        ...dimensions,
        left: !canvas.container && left || 0
      });

      canvas.container?.setStyle({
        left,
        width: canvas.width,
        top: GameObject.size,
        height: canvas.height - GameObject.size
      });
    }

    this.ctx.shadows.fillStyle = this.colors.shadow;
    // this.ctx.shadows.filter = "blur(2px)";

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
      console.log(canvas);
      canvas.clear();
    }
  }
}
