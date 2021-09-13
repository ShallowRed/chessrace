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

    this.ctx = this.canvas.getContext('2d');

    (this?.container || this)
    .domEl.style.zIndex = props?.zIndex || 0;

    this.draw = draw[props.shape](this.ctx);
  }

  getDimensions() {
    return this.dimensions(GameObject.playableZone, GameObject);
  }

  getShape = ({
    left = 0,
    top = 0,
    width = GameObject.size,
    height = GameObject.size,
    depth = GameObject.depth,
    offset = GameObject.offset
  }) => this.getShapeProps({ left, top, width, height, depth, offset })
}
