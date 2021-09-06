import GameObject from 'app/components/Game-object';

export default class Canvas extends GameObject {

  constructor({ className, inContainer }) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      inContainer,
      className
    });

    const ctx = this.ctx = this.canvas.getContext('2d');

    this.ctx.setShadow = {

      shadowColor: "#EEE",

      on() {
        const { offset } = GameObject;
        // ctx.shadowBlur = 1;
        ctx.fillStyle = "white";
        ctx.shadowColor = this.shadowColor;
        ctx.shadowOffsetX = offset.shadow + ctx.canvas.width;
        ctx.shadowOffsetY = offset.shadow + ctx.canvas.height;
      },

      off() {
        ctx.shadowColor = "transparent";
      }
    };
  }

  getBoundingClientRect() {
    return this.canvas.getBoundingClientRect();
  }
}
