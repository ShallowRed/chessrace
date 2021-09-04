import { setStyle } from "app/utils/set-style";
const { min, round } = Math;

export default class GameObject {

  static container = document.querySelector("main");

  static skippedRows = 0;

  static setSize(columns, rows) {

    this.size = min(
      round(1.05 * window.innerWidth / (columns + 1)),
      round(0.95 * window.innerHeight / (rows))
    );

    this.shadowShift = Math.round(this.size / 2);

    this.depth = Math.round(this.size / 6);

    this.leftOffset = this.shadowShift - this.depth;
  }

  translateY = ({ rows = 0, duration = 0 } = {}, element = this.domEl) => {
    element.style.transitionDuration = `${duration}s`;
    element.style.transform = `translateY(${rows * GameObject.size}px)`;
  }

  constructor({ dom, className, inContainer },
    parent = GameObject.container
  ) {

    if (dom instanceof HTMLElement) {

      this.domEl = dom;

    } else if (typeof dom === "object") {

      const [
        [key, domEl]
      ] = Object.entries(dom);

      this.domEl = this[key] = domEl;
    }

    if (className) {
      this.domEl.className = className;
    }

    if (inContainer) {

      this.container = new GameObject({
        dom: document.createElement('div'),
        className: `${className}-container`
      });

      parent = this.container.domEl;
    }

    parent.append(this.domEl);
  }

  setStyle = (config, value, element = this.domEl) => {
    setStyle.call(this, config, value, element);
  }

  onClick(callback) {
    this.domEl.addEventListener("click", callback);
  }
}
