import GameObject from 'app/components/Game-object';
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

    this.draw = draw[this.shape.type](this.ctx);
  }

  getDimensions() {

    return this.dimensions(GameObject);
  }

  getShape = ({
    left = 0,
    top = 0,
    width = GameObject.size,
    height = GameObject.size,
    depth = GameObject.depth,
    shadowOffset = GameObject.shadowOffset
  }) => {

    return this.shape.get({ left, top, width, height, depth, shadowOffset })
  }

  clear() {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
