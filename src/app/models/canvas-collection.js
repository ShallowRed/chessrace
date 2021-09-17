import Canvas from 'app/components/board/Canvas';

export default class CanvasCollection {

  canvas = {};
  ctx = {};

  constructor(config) {

    for (const name in config) {

      const canvas = new Canvas({ name, ...config[name] });

      this.canvas[name] = canvas;
      this.ctx[name] = canvas.ctx;
    }

    this.canvas.collection = Object.values(this.canvas);

    this.canvas.dynamicCollection = this.canvas.collection
      .filter(({ name }) => config[name].dynamic !== false);

    this.canvas.movableCollection = this.canvas.collection
      .filter(({ name }) => config[name].inContainer !== false);

    this.canvas.coloredCollection = this.canvas.collection
      .filter(({ name }) => config[name].isColored !== false);
  }
}
