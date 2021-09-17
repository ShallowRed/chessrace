import GameObject from 'app/components/Game-object';
import PlayArea from 'app/models/play-area';

import { draw } from "app/utils/draw-shapes";

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

    this.draw = draw[this?.shape?.type]?.(this.ctx);
  }

  getShape = ({
    left = 0,
    top = 0,
    width = PlayArea.size,
    height = PlayArea.size,
    thickness = PlayArea.offset.thickness,
    depth = PlayArea.offset.depth
  }) => {

    return this.shape.getProps({ left, top, width, height, thickness, depth })
  }

  clear() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
