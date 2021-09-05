import GameObject from 'app/components/Game-object';

export default class Canvas extends GameObject {

  shadowColor = "#EEE";

  constructor({ className, inContainer, shadowColor }) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      inContainer,
      className
    });

    this.ctx = this.canvas.getContext('2d');
    this.ctx.setShadow = {};
    this.ctx.setShadow.on = this.setShadow.on.bind(this);
    this.ctx.setShadow.off = this.setShadow.off.bind(this);
  }

  getBoundingClientRect() {
    return this.canvas.getBoundingClientRect();
  }

  setShadow = {

    on() {
      // ctx.shadowBlur = 1;
      this.ctx.fillStyle = "white";
      this.ctx.shadowColor = this.shadowColor;
      this.ctx.shadowOffsetX = GameObject.offset.shadow + this.canvas.width;
      this.ctx.shadowOffsetY = GameObject.offset.shadow + this.canvas.height;
    },

    off() {
      this.ctx.shadowColor = "transparent";
    }
  };
}
