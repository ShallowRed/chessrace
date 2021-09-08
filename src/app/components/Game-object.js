import { setStyle } from "app/utils/set-style";
const { min, round } = Math;

export default class GameObject {

  static container = document.querySelector("main");

  static skippedRows = 0;

  static setDimensions(columns, rows) {

    this.size = min(
      round(window.innerWidth / (columns + 1)),
      round(window.innerHeight / (rows + 2))
    );

    this.depth = round(this.size / 6);

    this.offset = {};
    this.offset.shadow = round(this.size / 3);
  }

  translateY = ({ rows = 0, duration = 0 } = {}) => {
    this.domEl.style.transitionDuration = `${duration}s`;
    this.domEl.style.transform = `translateY(${rows * GameObject.size}px)`;
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
