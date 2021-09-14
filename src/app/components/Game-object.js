import { setStyle } from "app/utils/set-style";

const { min, round } = Math;

export default class GameObject {

  static container = document.querySelector("main");

  static setDimensions(columns, rows) {

    this.size = min(
      round(window.innerWidth / (columns + 1)),
      round(window.innerHeight / (rows + 2))
    );

    this.depth = round(this.size / 6);

    this.offset = {};

    this.offset.shadow = round(this.size / 3);

    this.playableZone = {
      width: columns * this.size,
      height: rows * this.size,
    }

    setStyle(this.container, {
      width: this.playableZone.width + this.depth + this.offset.shadow,
      height: this.playableZone.height + this.depth + this.size,
    });
  }

  translateY = ({ rows = 0, duration = 0 } = {}) => {

    this.domEl.style.transitionDuration = `${duration}s`;

    this.domEl.style.transform = `translateY(${rows * GameObject.size}px)`;
  }

  constructor({ domEl, className, inContainer },
    parent = GameObject.container
  ) {

    if (domEl instanceof HTMLElement) {

      this.domEl = domEl;

    } else if (typeof domEl === "object") {

      const [
        [key, domElement]
      ] = Object.entries(domEl);

      this.domEl = this[key] = domElement;
    }

    if (className) {
      this.domEl.className = className;
    }

    if (inContainer) {

      this.container = new GameObject({
        domEl: document.createElement('div'),
        className: `${className}-container`
      });

      parent = this.container.domEl;
    }

    parent.append(this.domEl);
  }

  setStyle = config => {

    setStyle.call(this, this.domEl, config);
  }

  onClick(callback) {

    this.domEl.addEventListener("click", callback);
  }
}
