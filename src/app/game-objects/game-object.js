import PlayArea from 'app/game-objects/board/models/play-area';

import { setStyle } from "app/utils/set-style";

export default class GameObject {

  static container = new GameObject({
    domEl: document.createElement('main'),
    parent: document.querySelector("body")
  });

  static remove(gameObject) {

    this.container.domEl.removeChild(gameObject.domEl);
  }

  constructor({
    domEl = document.createElement('div'),
    parent = GameObject.container,
    className,
    inContainer
  } = {}) {

    this.domEl = domEl;

    if (inContainer) {

      this.container = parent = new GameObject();
    }

    if (className) {

      this.className = className;
    }

    parent.append(this.domEl);
  }

  set domEl(domEl) {

    if (domEl instanceof HTMLElement) {

      this.domElement = domEl;

    } else if (typeof domEl === "object") {

      const [key] = Object.keys(domEl);

      this.domElement = this[key] = domEl[key];
    }
  }

  get domEl() {

    return this.domElement;
  }

  set className(className) {

    this.domEl.className = className;

    this.container?.domEl.setAttribute("class", `${className}-container`);
  }

  append(el) {

    this.domEl.append(el);
  }

  translateY = ({ rows = 0, duration = 0 } = {}) => {

    this.domEl.style.transitionDuration = `${duration}s`;

    this.domEl.style.transform =
      `translateY(${rows * PlayArea.squareSize}px)`;
  }

  set style(config) {

    setStyle.call(this, { element: this.domEl, styles: config });
  }

  set zIndex(zIndex = 0) {

    (this?.container || this)
    .domEl.style.zIndex = zIndex;
  }

  onClick(callback) {

    this.domEl.addEventListener("click", callback);
  }
}
