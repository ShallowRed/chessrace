import { translateY } from "app/utils/utils";
const gameObjectsContainer = document.querySelector("main>div");
const { min, round } = Math;

export default class GameObject {

  static container = gameObjectsContainer;

  static skippedRows = 0;

  static setsize(columns, rows) {

    this.size = min(
      round(0.9 * window.innerWidth / (columns + 1)),
      round(0.9 * window.innerHeight / (rows))
    );

    this.shadowShift = Math.round(this.size / 2);

    this.depth = Math.round(this.size / 6);

    this.left = this.shadowShift - this.depth;

  }

  static translateOneSquareDown(nRenders, duration) {
    translateY(this.container, {
      distance: this.size * nRenders,
      duration
    });
  }

  static resetTranslation() {
    translateY(this.container);
  }

  constructor(domElement, key) {

    [
      [key, domElement]
    ] = Object.entries(domElement);

    this.domEl = this[key] = domElement;
    GameObject.container.append(domElement);
  }

  assign(props) {
    Object.assign(this, props);
  }


  onClick(callback) {
    this.domEl.addEventListener("click", callback);
  }
}
