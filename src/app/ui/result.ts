import { el, hide, show, stars } from 'app/ui/dom';

import type { Level } from 'app/level/levels';
import type { Rating } from 'app/level/par';

export interface WinReport {
  level: Level;
  moves: number;
  shortest: number;
  rating: Rating;
  hasNext: boolean;
}

export interface ResultActions {
  onNext: () => void;
  onRetry: () => void;
  onMenu: () => void;
}

export default class Result {

  readonly domEl: HTMLElement;

  private readonly panel: HTMLElement;

  constructor(private readonly actions: ResultActions) {

    this.panel = el("div", { className: "panel" });

    this.domEl = el("div", { className: "screen result" }, [this.panel]);

    this.domEl.hidden = true;

    document.body.append(this.domEl);
  }

  showWin({ level, moves, shortest, rating, hasNext }: WinReport): void {

    this.panel.replaceChildren(
      el("h2", { className: "outcome won", text: "Level cleared" }),
      el("p", { className: "level-name", text: level.name }),
      el("p", { className: "rating", text: stars(rating) }),
      el("p", {
        className: "detail",
        text: moves === shortest
          ? `${moves} moves, the shortest there is`
          : `${moves} moves, shortest is ${shortest}`
      }),
      el("div", { className: "actions" }, [
        ...(hasNext
          ? [el("button", { className: "primary", text: "Next level", onClick: this.actions.onNext })]
          : [el("p", { className: "detail", text: "That was the last one." })]),
        el("button", { text: "Play again", onClick: this.actions.onRetry }),
        el("button", { text: "Menu", onClick: this.actions.onMenu })
      ])
    );

    show(this.domEl);
  }

  showLoss(level: Level): void {

    this.panel.replaceChildren(
      el("h2", { className: "outcome lost", text: "You fell" }),
      el("p", { className: "level-name", text: level.name }),
      el("div", { className: "actions" }, [
        el("button", { className: "primary", text: "Try again", onClick: this.actions.onRetry }),
        el("button", { text: "Menu", onClick: this.actions.onMenu })
      ])
    );

    show(this.domEl);
  }

  hide(): void {

    hide(this.domEl);
  }
}
