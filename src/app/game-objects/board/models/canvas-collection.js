import Canvas from 'app/game-objects/board/models/canvas';
export default class CanvasCollections {
    constructor(config) {
      this.canvas = {};
      this.ctx = {};
        for (const name in config) {
            const canvas = new Canvas({ name, ...config[name] });
            this.canvas[name] = canvas;
            this.ctx[name] = canvas.ctx;
            canvas.zIndex = config[name].zIndex;
        }
        this.canvas.collection = Object.values(this.canvas);
        this.canvas.dynamicCollection = this.newCollection(config, "dynamic");
        this.canvas.movableCollection = this.newCollection(config, "inContainer");
        this.canvas.coloredCollection = this.newCollection(config, "isColored");
    }
    newCollection(config, condition) {
        return this.canvas.collection.filter(({ name }) => {
            return config[name][condition] !== false;
        });
    }
}
