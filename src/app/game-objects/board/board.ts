import events from 'app/game-events/event-emitter';

import GameObject from 'app/game-objects/game-object';

import PlayArea from 'app/game-objects/board/models/play-area';
import CanvasCollections from 'app/game-objects/board/models/canvas-collection';

import * as boardSquare from 'app/game-objects/board/models/board-square';
import render from 'app/game-objects/board/render';

import { canvasConfig, colors } from 'app/game-objects/board/board-config';

import { bindObjectsMethods } from "app/utils/bind-methods";

import type LevelModel from 'app/level/model';
import type { CanvasMap } from 'app/game-objects/board/models/canvas-collection';
import type { CanvasName } from 'app/game-objects/board/board-config';
import type { Bound } from 'app/types';

export default class Board {

  nRenders = 0;

  declare columns: number;

  declare rows: number;

  declare colors: typeof colors;

  declare canvas: CanvasMap;

  declare ctx: Record<CanvasName, CanvasRenderingContext2D>;

  declare getSquare: Bound<typeof boardSquare.getSquare>;

  declare isSquare: Bound<typeof boardSquare.isSquare>;

  declare squares: Bound<typeof render.squares> & {
    includes: (coords: readonly number[]) => boolean;
  };

  declare finishLine: Bound<typeof render.finishLine>;

  declare input: Bound<typeof render.input>;

  constructor({ columns, rows }: { columns: number; rows: number }) {

    Object.assign(
      this, { columns, rows, colors },
      new CanvasCollections(canvasConfig)
    );

    bindObjectsMethods.call(
      this as unknown as Record<string, unknown>,
      { ...boardSquare, ...render }
    );

    this.canvas.frontFaces.onClick(evt => {

      events.emit("CANVAS_CLICKED", evt);
    });
  }

  setDimensions(): void {

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

  render(model: LevelModel): void {

    this.squares.render(model.regularSquares, model.square.isHeld);

    if (model.lastRowRendered === model.rows - 1) {

      this.finishLine.render(model.rows);
    }
  }

  clear(): void {

    for (const canvas of this.canvas.dynamicCollection) {

      canvas.clear();
    }
  }
}
