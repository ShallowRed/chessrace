import events from 'app/game-events/event-emitter';

import GameObject from 'app/game-objects/game-object';

import PlayArea from 'app/game-objects/board/models/play-area';
import CanvasCollections from 'app/game-objects/board/models/canvas-collection';

import * as boardSquare from 'app/game-objects/board/models/board-square';
import render from 'app/game-objects/board/render/';

import { canvasConfig, colors } from 'app/game-objects/board/board-config';

import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Board {

  nRenders = 0;

  constructor({ columns, rows }) {

    Object.assign(
      this, { columns, rows, colors },
      new CanvasCollections(canvasConfig)
    );

    bindObjectsMethods.call(this, { ...boardSquare, ...render });

    this.canvas.frontFaces.onClick(evt => {

      events.emit("CANVAS_CLICKED", evt);
    });
  }

  setDimensions() {

    PlayArea.setDimensions(this.columns, this.rows);

    const { width, height, thickness, squareSize, offset } = PlayArea;

    GameObject.container.style = {
      width: width + thickness + offset.left + offset.right,
      height: height + squareSize + offset.top,
      top: 5
    };

    for (const canvas of this.canvas.collection) {

      canvas.dimensions = canvas.getDimensions(PlayArea);
    }

    this.ctx.shadows.fillStyle = this.colors.shadow;

    this.input.render();
  }

  render(model) {

    this.squares.render(model.regularSquares);

    if (model.lastRowRendered === model.rows - 1) {

      this.finishLine.render(model.rows);
    }
  }

  clear() {

    for (const canvas of this.canvas.dynamicCollection) {

      canvas.clear();
    }
  }
}
