const gameObjectsContainer = document.querySelector("main>div");
const { min, round } = Math;

export default class GameObject {

  static container = gameObjectsContainer;

  static skippedRows = 0;

  static setSquareSize(columns, rows) {

    this.squareSize = min(
      round(window.innerWidth / (columns + 1)),
      round(window.innerHeight / (rows))
    );

    this.shadowShift = round(this.squareSize / 4);
  }

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
