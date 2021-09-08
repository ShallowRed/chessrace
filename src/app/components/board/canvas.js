import GameObject from 'app/components/Game-object';
import { bindObjectsMethods } from "app/utils/bind-methods";
import * as Shapes from 'app/components/board/shapes';

export default class Canvas extends GameObject {

  constructor(props) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      className: `board-part ${props.name}`,
      inContainer: props.inContainer
    });

    Object.assign(this, props);

    this.ctx = this.canvas.getContext('2d');

    bindObjectsMethods.call(this, { draw: Shapes });
  }
}
