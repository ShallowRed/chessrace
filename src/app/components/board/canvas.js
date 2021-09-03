import GameObject from 'app/components/Game-object';

export default class Canvas extends GameObject {

  constructor({ className, isInContainer }) {

    super({
      dom: {
        canvas: document.createElement('canvas')
      },
      isInContainer,
      className
    });

    this.ctx = this.canvas.getContext('2d');
  }

  getBoundingClientRect() {
    return this.canvas.getBoundingClientRect();
  }
}
