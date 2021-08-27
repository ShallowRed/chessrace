import { columns } from "app/config";

const gameObjectsContainer = document.querySelector("main>div");
const { ceil, min, round } = Math;

export default class GameObject {

  static skippedRows = 0;
  static squareSize = ceil(min(window.innerWidth * 0.7, 500) / columns);
  static shadowShift = round(GameObject.squareSize / 4);

  static container = gameObjectsContainer;

  constructor(domElement, key) {

    [
      [key, domElement]
    ] = Object.entries(domElement);

    this.domEl = this[key] = domElement;
    GameObject.container.append(domElement);
  }

  onClick(callback) {
    this.domEl.addEventListener("click", callback);
  }
}
