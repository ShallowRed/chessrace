import PlayArea from 'app/game-objects/board/models/play-area';

import { setStyle } from "app/utils/set-style";

export default class GameObject {

  static container = document.querySelector("main");

  constructor(props, parent = GameObject.container ) {

    if (props.domEl instanceof HTMLElement) {

      this.domEl = props.domEl;

    } else if (typeof props.domEl === "object") {

      const [
        [key, domEl]
      ] = Object.entries(props.domEl);

      this.domEl = this[key] = domEl;
    }

    if (props.inContainer) {

      this.container = new GameObject({
        domEl: document.createElement('div'),
        className: `${props.className}-container`
      });

      parent = this.container.domEl;
    }

    this.domEl.className = props.className;

    parent.append(this.domEl);
  }

  translateY = ({ rows = 0, duration = 0 } = {}) => {

    this.domEl.style.transitionDuration = `${duration}s`;

    this.domEl.style.transform = `translateY(${rows * PlayArea.squareSize}px)`;
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
