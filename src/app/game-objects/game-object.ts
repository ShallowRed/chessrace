import PlayArea from 'app/game-objects/board/models/play-area';

import { setStyle, type StyleValues } from "app/utils/set-style";

export interface TranslateOptions {
  rows?: number | undefined;
  duration?: number | undefined;
}

interface Appendable {
  append(el: HTMLElement): void;
}

export interface GameObjectOptions {
  domEl?: HTMLElement | Record<string, HTMLElement>;
  parent?: Appendable;
  className?: string;
  inContainer?: boolean;
}

export default class GameObject {

  static container = new GameObject({
    domEl: document.createElement('main'),
    parent: document.body
  });

  static remove(gameObject: GameObject): void {

    this.container.domEl.removeChild(gameObject.domEl);
  }

  declare domElement: HTMLElement;

  container?: GameObject;

  constructor({
    domEl = document.createElement('div'),
    parent = GameObject.container,
    className,
    inContainer
  }: GameObjectOptions = {}) {

    this.domEl = domEl;

    if (inContainer) {

      this.container = parent = new GameObject();
    }

    if (className) {

      this.className = className;
    }

    parent.append(this.domEl);
  }

  set domEl(domEl: HTMLElement | Record<string, HTMLElement>) {

    if (domEl instanceof HTMLElement) {

      this.domElement = domEl;

    } else {

      const [key] = Object.keys(domEl);

      const element = domEl[key as string] as HTMLElement;

      this.domElement = element;

      (this as unknown as Record<string, unknown>)[key as string] = element;
    }
  }

  get domEl(): HTMLElement {

    return this.domElement;
  }

  set className(className: string) {

    this.domEl.className = className;

    this.container?.domEl.setAttribute("class", `${className}-container`);
  }

  append(el: HTMLElement): void {

    this.domEl.append(el);
  }

  empty(): void {

    this.domEl.replaceChildren();
  }

  translateY = ({ rows = 0, duration = 0 }: TranslateOptions = {}): void => {

    this.domEl.style.transitionDuration = `${duration}s`;

    this.domEl.style.transform =
      `translateY(${rows * PlayArea.squareSize}px)`;
  }

  set style(config: StyleValues) {

    setStyle.call(this as unknown as Record<string, unknown>, {
      element: this.domEl,
      styles: config
    });
  }

  set zIndex(zIndex: number) {

    (this.container ?? this)
    .domEl.style.zIndex = `${zIndex}`;
  }

  onClick(callback: (event: MouseEvent) => void): void {

    this.domEl.addEventListener("click", callback);
  }
}
