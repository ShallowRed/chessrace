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

  set dimensions({ left, ...dimensions }) {

    this.style = dimensions;

    this.pixelRatio = PIXEL_RATIO;

    if (!this.container) {

      this.style = { left };

    } else {

      this.container.style = {
        width: this.width,
        height: this.height - PlayArea.squareSize,
        top: PlayArea.offset.top,
        left
      };
    }
  }

  set pixelRatio(ratio) {

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
  }) => {

    return this.shape.getProps({
      left,
      top,
      width,
      height,
      thickness,
      offsetShadow
    })
  }

  clear() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
