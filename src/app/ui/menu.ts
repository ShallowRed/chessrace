import { el, hide, show, stars } from 'app/ui/dom';

import {
  clearedCount,
  freshnessOf,
  isCompleted,
  isUnlocked,
  isWorldUnlocked
} from 'app/progress';

import { par, rate } from 'app/level/par';

import type { Level, World } from 'app/level/catalogue';
import type { Freshness, Progress } from 'app/progress';

const BADGE: Record<Freshness, string> = {
  untested: "new",
  changed: "changed",
  tested: ""
};

export default class Menu {

  readonly domEl: HTMLElement;

  private readonly list: HTMLElement;

  private readonly note: HTMLElement;

  private dev = false;

  constructor(
    private readonly worlds: World[],
    private readonly onPick: (level: Level) => void
  ) {

    this.list = el("div", { className: "worlds" });

    this.note = el("p", { className: "dev-note", text: "dev: every level open" });

    this.note.hidden = true;

    this.domEl = el("div", { className: "screen menu" }, [
      el("h1", { className: "title", text: "Chessrace" }),
      el("p", { className: "tagline", text: "Climb the board. Take a piece, become it." }),
      this.note,
      this.list
    ]);

    this.domEl.hidden = true;

    document.body.append(this.domEl);
  }

  show(progress: Progress, dev = false): void {

    this.dev = dev;

    this.note.hidden = !dev;

    this.list.replaceChildren(...this.worlds
      .map(world => this.section(world, progress)));

    show(this.domEl);
  }

  hide(): void {

    hide(this.domEl);
  }

  private section(world: World, progress: Progress): HTMLElement {

    const open = this.dev || isWorldUnlocked(progress, this.worlds, world.slug);

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

    const open = this.dev || isUnlocked(progress, this.worlds, level.slug);

    const best = progress.best[level.slug];

    const freshness = freshnessOf(progress, level);

    const button = el("button", {
      className: `level${open ? "" : " locked"}`,
      onClick: () => open && this.onPick(level)
    }, [
      el("span", { className: "rank", text: `${index + 1}` }),
      el("span", { className: "name", text: level.name }),
      ...this.dev
        ? [el("span", { className: `freshness ${freshness}`, text: BADGE[freshness] })]
        : [],
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
