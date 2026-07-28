import { el, hide, show } from 'app/ui/dom';

import type { Level } from 'app/level/levels';

export interface HudActions {
  onMenu: () => void;
  onToggleSound: () => boolean;
}

export default class Hud {

  readonly domEl: HTMLElement;

  private readonly name: HTMLElement;

  private readonly hint: HTMLElement;

  private readonly sound: HTMLButtonElement;

  constructor({ onMenu, onToggleSound }: HudActions, muted: boolean) {

    this.name = el("span", { className: "level-name" });

    this.hint = el("p", { className: "hint" });

    this.sound = el("button", {
      className: "to-sound",
      text: "\u266a",
      onClick: () => this.setMuted(onToggleSound())
    });

    this.setMuted(muted);

    this.domEl = el("div", { className: "hud" }, [
      el("div", { className: "hud-text" }, [this.name, this.hint]),
      el("div", { className: "hud-buttons" }, [
        this.sound,
        el("button", { className: "to-menu", text: "Menu", onClick: onMenu })
      ])
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

  private setMuted(muted: boolean): void {

    this.sound.classList.toggle("muted", muted);

    this.sound.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");

    this.sound.setAttribute("aria-pressed", `${!muted}`);
  }
}
