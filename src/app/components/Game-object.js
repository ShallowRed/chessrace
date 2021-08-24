export default class GameObject {

  columns = 8;
  squareSize = Math.ceil(Math.min(window.innerWidth * 0.5, 500) / this.columns);
  shadowShift = Math.round(this.squareSize / 4);

  container = document.querySelector("main");

  constructor(domEl) {
    this.domEl = () => this[domEl];
  }

  translateY(distance = 0, duration = 0) {
    this.domEl().style.transitionDuration = `${duration}s`;
    this.domEl().style.transform = `translateY(${distance}px)`;
  }

  resetTranslation() {
    this.translateY();
  }
}
