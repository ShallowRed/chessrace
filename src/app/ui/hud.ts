import { el, hide, show } from 'app/ui/dom';

import type { Level } from 'app/level/levels';

export default class Hud {

  readonly domEl: HTMLElement;

  private readonly name: HTMLElement;

  constructor(onMenu: () => void) {

    this.name = el("span", { className: "level-name" });

    this.domEl = el("div", { className: "hud" }, [
      this.name,
      el("button", { className: "to-menu", text: "Menu", onClick: onMenu })
    ]);

    this.domEl.hidden = true;

    document.body.append(this.domEl);
  }

  show(level: Level): void {

    this.name.textContent = level.name;

    show(this.domEl);
  }

  hide(): void {

    hide(this.domEl);
  }
}
