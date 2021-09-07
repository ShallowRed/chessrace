import GameObject from 'app/components/Game-object';
import { bindObjectsMethods } from "app/utils/bind-methods";

export default class Canvas extends GameObject {

  constructor({ key, colors, inContainer }) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      inContainer,
      className: `board-part ${key}`
    });

    this.key = key;
    this.colors = colors;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.setColor = (key) => {
      this.ctx.fillStyle = this.colors.squares[key][this.key];
    }

    // bindObjectsMethods.call(this, { draw: Draw });
    bindObjectsMethods.call(this, { draw: this.draw });
  }



  draw = {

    square({ left, top, size = GameObject.size }) {

      this.ctx.fillRect(left, top, size, size);
    },

    rectangle({ left = 0, top = 0, width, height }) {

      this.ctx.fillRect(left, top, width, height);
    },

    bottomFace({ left = 0, top = 0, size = GameObject.size }) {

      const { depth } = GameObject;

      this.ctx.beginPath();
      this.ctx.moveTo(left, top);
      this.ctx.lineTo(left + size, top);
      this.ctx.lineTo(left + size + depth, top + depth);
      this.ctx.lineTo(left + depth, top + depth);
      this.ctx.closePath();
      this.ctx.fill();
    },

    rightFace({ left, top, size = GameObject.size }) {

      const { depth } = GameObject;

      this.ctx.beginPath();
      this.ctx.moveTo(left, top);
      this.ctx.lineTo(left + depth, top + depth);
      this.ctx.lineTo(left + depth, top + size + depth);
      this.ctx.lineTo(left, top + size);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
}
