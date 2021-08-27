const gameObjectsContainer = document.querySelector("main>div");

export default class GameObject {

  static skippedRows = 0;

  container = gameObjectsContainer;

  constructor(domElement, key) {

    [
      [key, domElement]
    ] = Object.entries(domElement);

    this.domEl = this[key] = domElement;
    this.container.append(domElement);
  }

  assign(props) {
    Object.assign(this, props);
  }

  onClick(callback) {
    this.domEl.addEventListener("click", callback);
  }
}
