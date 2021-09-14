import events from 'app/models/events';

import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/Canvas';

import boardColors from 'app/components/board/board-config-colors';
import * as boardPartsConfig from 'app/components/Board/board-config-parts';

import * as BoardSquare from 'app/components/Board/Board-square';
import * as RenderSquares from 'app/components/Board/render-squares';
import * as FinishLine from 'app/components/Board/render-finishing-line';

import { bindObjectsMethods } from "app/utils/bind-methods";
// import { test } from "app/utils/test";

export default class Board {

  nRenders = 0;
  canvas = {};
  ctx = {};

  constructor(columns, rows) {

    Object.assign(this, { columns, rows });

    bindObjectsMethods.call(this, {
      squares: RenderSquares,
      square: BoardSquare,
      finishLine: FinishLine,
    });

    this.createParts();

    this.canvas.frontFaces.onClick(evt => {
      events.emit("SQUARE_CLICKED", this.square.get.clicked(evt));
    });
  }

  createParts() {

    for (const name in boardPartsConfig) {

      const canvas = new Canvas({ name, ...boardPartsConfig[name] });

      this.canvas[name] = canvas;
      this.ctx[name] = canvas.ctx;
    }

    this.dynamicCanvas = Object.values(this.canvas)
      .filter(({ name }) => boardPartsConfig[name].inContainer !== false);

    this.coloredCanvas = Object.values(this.canvas)
      .filter(({ name }) => boardPartsConfig[name].isColored !== false);
  }

  setDimensions() {

    for (const canvas of Object.values(this.canvas)) {

      const { left, ...dimensions } = canvas.getDimensions();

      canvas.setStyle(dimensions);

      canvas.container?.setStyle({
        left,
        width: canvas.width,
        height: canvas.height - GameObject.size
      });
    }

    this.ctx.shadows.fillStyle = boardColors.shadow;
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

    for (const name in this.canvas) {

      const canvas = this.canvas[name];

      canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
