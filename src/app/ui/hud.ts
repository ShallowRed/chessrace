import { el, hide, show } from 'app/ui/dom';

import type { Level } from 'app/level/levels';

export default class Hud {

  readonly domEl: HTMLElement;

  private readonly name: HTMLElement;

  private readonly hint: HTMLElement;

  constructor(onMenu: () => void) {

    this.name = el("span", { className: "level-name" });

    this.hint = el("p", { className: "hint" });

    this.domEl = el("div", { className: "hud" }, [
      el("div", { className: "hud-text" }, [this.name, this.hint]),
      el("button", { className: "to-menu", text: "Menu", onClick: onMenu })
    ]);

    this.domEl.hidden = true;

    document.body.append(this.domEl);
  }

  get height(): number {

    return this.domEl.offsetHeight;
  }

  show(level: Level): void {

    this.name.textContent = level.name;

    this.hint.textContent = level.hint ?? "";

    this.hint.hidden = !level.hint;

    show(this.domEl);
  }

  hide(): void {

    hide(this.domEl);
  }
}
