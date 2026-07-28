import Canvas from 'app/game-objects/board/models/canvas';

import type { CanvasConfig, CanvasName } from 'app/game-objects/board/board-config';

type CanvasConfigMap = Record<CanvasName, CanvasConfig>;

export type CanvasMap = Record<CanvasName, Canvas> & {
  collection: Canvas[];
  dynamicCollection: Canvas[];
  movableCollection: Canvas[];
  coloredCollection: Canvas[];
};

export default class CanvasCollections {

  canvas: CanvasMap;

  ctx: Record<CanvasName, CanvasRenderingContext2D>;

  constructor(config: CanvasConfigMap) {

    const canvases = {} as Record<CanvasName, Canvas>;

    const contexts = {} as Record<CanvasName, CanvasRenderingContext2D>;

    for (const name of Object.keys(config) as CanvasName[]) {

      const canvas = new Canvas({ name, ...config[name] });

      canvases[name] = canvas;

      contexts[name] = canvas.ctx;

      canvas.zIndex = config[name].zIndex;
    }

    const collection = Object.values(canvases);

    this.canvas = Object.assign(canvases, {

      collection,

      dynamicCollection: newCollection(collection, config, "dynamic"),

      movableCollection: newCollection(collection, config, "inContainer"),

      coloredCollection: newCollection(collection, config, "isColored")
    });

    this.ctx = contexts;
  }
}

function newCollection(
  collection: Canvas[],
  config: CanvasConfigMap,
  condition: "dynamic" | "inContainer" | "isColored"
): Canvas[] {

  return collection.filter(({ name }) => config[name][condition] !== false);
}
