import GameObject from 'app/game-objects/game-object';
import PlayArea from 'app/game-objects/board/models/play-area';

import { draw } from "app/utils/draw-shapes";
import { PIXEL_RATIO } from "app/utils/set-pixel-ratio";

export default class Canvas extends GameObject {

  constructor({ inContainer = true, ...props }) {

    super({
      domEl: { canvas: document.createElement('canvas') },
      className: `board-part ${props.name}`,
      inContainer
    });

    Object.assign(this, props);

    this.setZIndex();

    this.ctx = this.canvas.getContext('2d');

    this.draw = draw[this.shape?.type]?.(this.ctx);
  }

  setPixelRatio() {

    if (PIXEL_RATIO === 1) return;

    this.canvas.width = this.width * PIXEL_RATIO;
    this.canvas.height = this.height * PIXEL_RATIO;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
  }

  getShape = ({
    left = 0,
    top = 0,
    width = PlayArea.squareSize,
    height = PlayArea.squareSize,
    thickness = PlayArea.offset.thickness,
    depth = PlayArea.offset.depth
  }) => {

    return this.shape.getProps({ left, top, width, height, thickness, depth })
  }

  clear() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
