import PlayArea from 'app/models/play-area';

import { setStyle } from "app/utils/set-style";

export default class GameObject {

  static container = document.querySelector("main");

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

    this.domEl.className = className;

    if (inContainer) {

      this.container = new GameObject({
        domEl: document.createElement('div'),
        className: `${className}-container`
      });

      parent = this.container.domEl;
    }

    parent.append(this.domEl);
  }

  translateY = ({ rows = 0, duration = 0 } = {}) => {

    this.domEl.style.transitionDuration = `${duration}s`;

    this.domEl.style.transform = `translateY(${rows * PlayArea.size}px)`;
  }

  setStyle = config => {

    setStyle.call(this, this.domEl, config);
  }

  setZIndex() {

    (this?.container || this)
    .domEl.style.zIndex = this?.zIndex || 0;
  }

  onClick(callback) {

    this.domEl.addEventListener("click", callback);
  }
}
