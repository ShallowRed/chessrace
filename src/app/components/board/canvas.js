import GameObject from 'app/components/Game-object';
import * as drawShapes from 'app/components/board/draw-shapes';

import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Canvas extends GameObject {

  constructor({ inContainer = true, ...props }) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      className: `board-part ${props.name}`,
      inContainer
    });

    Object.assign(this, props);

    this.ctx = this.canvas.getContext('2d');

    (this?.container || this)
    .domEl.style.zIndex = props?.zIndex || 0;

    bindObjectsMethods.call(this, { draw: drawShapes });
  }
}
