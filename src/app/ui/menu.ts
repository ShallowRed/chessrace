import { el, hide, show, stars } from 'app/ui/dom';
import { isCompleted, isUnlocked } from 'app/progress';
import { par, rate } from 'app/level/par';

import type { Level } from 'app/level/catalogue';
import type { Progress } from 'app/progress';

export default class Menu {

  readonly domEl: HTMLElement;

  private readonly list: HTMLElement;

  constructor(
    private readonly levels: Level[],
    private readonly onPick: (level: Level) => void
  ) {

    this.list = el("ol", { className: "levels" });

    this.domEl = el("div", { className: "screen menu" }, [
      el("h1", { className: "title", text: "Chessrace" }),
      el("p", { className: "tagline", text: "Climb the board. Take a piece, become it." }),
      this.list
    ]);

    this.domEl.hidden = true;

    document.body.append(this.domEl);
  }

  render(progress: Progress): void {

    this.list.replaceChildren(...this.levels.map((level, index) =>
      el("li", {}, [this.entry(level, index, progress)])));
  }

  show(progress: Progress): void {

    this.render(progress);

    show(this.domEl);
  }

  hide(): void {

    hide(this.domEl);
  }

  private entry(level: Level, index: number, progress: Progress): HTMLElement {

    const unlocked = isUnlocked(progress, this.levels, level.slug);

    const best = progress.best[level.slug];

    const button = el("button", {
      className: `level${unlocked ? "" : " locked"}`,
      onClick: () => unlocked && this.onPick(level)
    }, [
      el("span", { className: "rank", text: `${index + 1}` }),
      el("span", { className: "name", text: level.name }),
      el("span", {
        className: "score",
        text: isCompleted(progress, level.slug) && best !== undefined
          ? stars(rate(best, par(level)))
          : unlocked ? "" : "locked"
      })
    ]);

    button.disabled = !unlocked;

    return button;
  }
}
