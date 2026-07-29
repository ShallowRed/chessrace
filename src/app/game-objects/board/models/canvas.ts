import GameObject from 'app/game-objects/game-object';
import PlayArea from 'app/game-objects/board/models/play-area';

import { windowHeightOf } from 'app/game-objects/board/board-config';

import { drawerFor } from "app/utils/draw-shapes";

import { PIXEL_RATIO } from "app/utils/set-pixel-ratio";

import type Board from 'app/game-objects/board/board';
import type { CanvasConfig, CanvasName } from 'app/game-objects/board/board-config';
import type { StyleValues } from 'app/utils/set-style';
import type { Coords, Dimensions, FaceType, Shape, ShapeInput } from 'app/types';

interface CanvasOptions extends CanvasConfig {
  name: CanvasName;
}

export default class Canvas extends GameObject {

  declare canvas: HTMLCanvasElement;

  declare width: number;

  declare height: number;

  declare name: CanvasName;

  declare getDimensions: (playArea: typeof PlayArea) => Dimensions;

  declare filter?: (this: Board, squares: Coords[]) => Coords[];

  // Only the input canvases lack a shape, and they never reach a draw path.
  declare shape: { type: FaceType; getProps: (shape: Shape) => Shape };

  ctx: CanvasRenderingContext2D;

  draw: (shape: Shape) => void;

  constructor({ inContainer = true, ...props }: CanvasOptions) {

    super({
      domEl: { canvas: document.createElement('canvas') },
      className: `board-part ${props.name}`,
      inContainer
    });

    Object.assign(this, props);

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.draw = (props.shape && drawerFor(props.shape.type, this.ctx)) as (shape: Shape) => void;
  }

  set dimensions({ left, ...dimensions }: Dimensions) {

    this.style = dimensions;

    this.pixelRatio = PIXEL_RATIO;

    if (!this.container) {

      this.style = { left } as StyleValues;

    } else {

      this.container.style = {
        width: this.width,
        height: windowHeightOf(this.height, PlayArea),
        top: PlayArea.offset.top,
        left
      } as StyleValues;
    }
  }

  set pixelRatio(ratio: number) {

    if (ratio === 1) return;

    this.canvas.width = this.width * ratio;
    this.canvas.height = this.height * ratio;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(ratio, ratio);
  }

  getShape = ({
    left = 0,
    top = 0,
    width = PlayArea.squareSize,
    height = PlayArea.squareSize,
    thickness = PlayArea.thickness,
    offsetShadow = PlayArea.offset.shadow
  }: ShapeInput): Shape => {

    return this.shape.getProps({
      left,
      top,
      width,
      height,
      thickness,
      offsetShadow
    })
  }

  clear(): void {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
