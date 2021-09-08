import GameObject from 'app/components/Game-object';
import { bindObjectsMethods } from "app/utils/bind-methods";
import * as Shapes from 'app/components/board/shapes';

export default class Canvas extends GameObject {

  constructor({ inContainer, isColored, name, shape, filter }) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      inContainer,
      className: `board-part ${name}`
    });

    Object.assign(this, { inContainer, isColored, name, shape, filter });

    this.ctx = this.canvas.getContext('2d');

    bindObjectsMethods.call(this, { draw: Shapes });
  }
}
