import { el, hide, show, stars } from 'app/ui/dom';
import { clearedCount, isCompleted, isUnlocked, isWorldUnlocked } from 'app/progress';
import { par, rate } from 'app/level/par';

import type { Level, World } from 'app/level/catalogue';
import type { Progress } from 'app/progress';

export default class Menu {

  readonly domEl: HTMLElement;

  private readonly list: HTMLElement;

  constructor(
    private readonly worlds: World[],
    private readonly onPick: (level: Level) => void
  ) {

    this.list = el("div", { className: "worlds" });

    this.domEl = el("div", { className: "screen menu" }, [
      el("h1", { className: "title", text: "Chessrace" }),
      el("p", { className: "tagline", text: "Climb the board. Take a piece, become it." }),
      this.list
    ]);

    this.domEl.hidden = true;

    document.body.append(this.domEl);
  }

  show(progress: Progress): void {

    this.list.replaceChildren(...this.worlds
      .map(world => this.section(world, progress)));

    show(this.domEl);
  }

  hide(): void {

    hide(this.domEl);
  }

  private section(world: World, progress: Progress): HTMLElement {

    const open = isWorldUnlocked(progress, this.worlds, world.slug);

    return el("section", { className: `world${open ? "" : " locked"}` }, [
      el("header", {}, [
        el("h2", { className: "world-name", text: world.name }),
        el("span", {
          className: "world-score",
          text: open
            ? `${clearedCount(progress, world)}/${world.levels.length}`
            : "locked"
        })
      ]),
      el("p", { className: "world-blurb", text: world.blurb }),
      el("ol", { className: "levels" }, world.levels
        .map((level, index) => el("li", {}, [this.entry(level, index, progress)])))
    ]);
  }

  private entry(level: Level, index: number, progress: Progress): HTMLElement {

    const open = isUnlocked(progress, this.worlds, level.slug);

    const best = progress.best[level.slug];

    const button = el("button", {
      className: `level${open ? "" : " locked"}`,
      onClick: () => open && this.onPick(level)
    }, [
      el("span", { className: "rank", text: `${index + 1}` }),
      el("span", { className: "name", text: level.name }),
      el("span", {
        className: "score",
        text: isCompleted(progress, level.slug) && best !== undefined
          ? stars(rate(best, par(level)))
          : ""
      })
    ]);

    button.disabled = !open;

    return button;
  }
}
