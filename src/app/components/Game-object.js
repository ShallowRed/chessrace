export default class GameObject {

  container = document.querySelector("main");

  constructor(obj) {
    const [[key, value]] = Object.entries(obj);
    this.domEl = this[key] = value;
  }

  assign(props) {
    Object.assign(this, props);
  }

  translateY(distance = 0, duration = 0) {
    this.domEl.style.transitionDuration = `${duration}s`;
    this.domEl.style.transform = `translateY(${distance}px)`;
  }

  resetTranslation() {
    this.translateY();
  }
}
