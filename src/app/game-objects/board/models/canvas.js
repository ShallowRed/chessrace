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

    this.ctx = this.canvas.getContext('2d');

    this.draw = draw[this.shape?.type]?.(this.ctx);
  }

  setDimensions({
    canvasDimensions: { left, ...canvasDimensions },
    getContainerDimensions
  }) {

    this.setStyle(canvasDimensions);

    this.setPixelRatio();

    if (this.container) {

      this.container.setStyle({ left, ...getContainerDimensions(this) });

    } else {

      this.setStyle({ left });
    }

  }

  setPixelRatio() {

    if (PIXEL_RATIO === 1) return;

    const { canvas, ctx, width, height } = this;

    canvas.width = width * PIXEL_RATIO;
    canvas.height = height * PIXEL_RATIO;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(PIXEL_RATIO, PIXEL_RATIO);
  }

  getShape = ({
    left = 0,
    top = 0,
    width = PlayArea.squareSize,
    height = PlayArea.squareSize,
    thickness = PlayArea.thickness,
    depth = PlayArea.offset.depth
  }) => {

    return this.shape.getProps({ left, top, width, height, thickness, depth })
  }

  clear() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
