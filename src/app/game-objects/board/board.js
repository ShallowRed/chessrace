import events from 'app/game-events/event-emitter';

import GameObject from 'app/game-objects/game-object';

import PlayArea from 'app/game-objects/board/models/play-area';
import CanvasCollections from 'app/game-objects/board/models/canvas-collection';

import {
  getSquare,
  isSquare
} from 'app/game-objects/board/models/board-square';

import render from 'app/game-objects/board/render/';

import { canvasConfig, colors } from 'app/game-objects/board/board-config';

import { setStyle } from "app/utils/set-style";
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Board {

  nRenders = 0;

  constructor({ columns, rows }) {

    Object.assign(
      this, { columns, rows, colors },
      new CanvasCollections(canvasConfig)
    );

    bindObjectsMethods.call(this, { getSquare, isSquare, ...render });

    this.canvas.frontFaces.onClick(evt => {

      events.emit("CANVAS_CLICKED", evt);
    });
  }

  getDimensions(PlayArea) {

    const { width, height, thickness, squareSize, offset } = PlayArea;

    return {

      gameObjectContainerDimensions: {
        width:  width + thickness + offset.left * 2,
        height: height + squareSize + offset.top,
        top: 5
      },

      getCanvasDimensions: canvas => ({

        canvasDimensions: canvas.getDimensions(PlayArea),

        getContainerDimensions: canvas => ({
          width: canvas.width,
          height: canvas.height - squareSize,
          top: offset.top
        })
      })
    };
  }

  setDimensions() {

    PlayArea.setDimensions(this.columns, this.rows);

    const {
      gameObjectContainerDimensions,
      getCanvasDimensions
    } = this.getDimensions(PlayArea);

    setStyle(GameObject.container, gameObjectContainerDimensions);

    for (const canvas of this.canvas.collection) {

      canvas.setDimensions(getCanvasDimensions(canvas));
    }

    this.ctx.shadows.fillStyle = this.colors.shadow;

    this.input.render();
  }

  render(model) {

    this.squares.render(model.regularSquares);

    if (model.lastRowRendered !== model.rows - 1) return

    this.finishLine.render(model.rows);
  }

  clear() {

    for (const canvas of this.canvas.dynamicCollection) {

      canvas.clear();
    }
  }
}
