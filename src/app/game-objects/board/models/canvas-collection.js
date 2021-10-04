import Canvas from 'app/game-objects/board/models/canvas';

export default class CanvasCollections {

  canvas = {};

  ctx = {};

  constructor(config) {

    for (const name in config) {

      const canvas = new Canvas({ name, ...config[name] });

      this.canvas[name] = canvas;

      this.ctx[name] = canvas.ctx;

      canvas.setZIndex();
    }

    this.canvas.collection = Object.values(this.canvas);

    this.canvas.dynamicCollection = this.newCollection(config, "dynamic");

    this.canvas.movableCollection = this.newCollection(config, "inContainer");

    this.canvas.coloredCollection = this.newCollection(config, "isColored");
    console.log(this.canvas);
  }

  newCollection(config, condition) {

    return this.canvas.collection.filter(({ name }) => {

      return config[name][condition] !== false
    });
  }
}
