import { describe, expect, it } from "vitest";

import { blueprintOf, levelBySlug } from "app/level/catalogue";
import { score } from "app/level/fitness";
import { parseLevelGrid } from "app/level/notation";
import { parseBlueprint } from "app/utils/parse-blueprint";

import { widthOf } from "./support";

import type { Level } from "app/level/catalogue";
import type { PieceName } from "app/types";

const onGrid = (
  grid: string,
  pieceName: PieceName,
  { column = 0, speedUp }: { column?: number; speedUp?: number } = {}
) => {
  const columns = widthOf(grid);

  const level: Level = {
    ...levelBySlug("climb"),
    columns,
    rows: grid.trim().split("\n").length,
    spawn: { position: [column, 0], pieceName },
    blueprint: parseLevelGrid(grid),
    speedUp
  };

  return score(level, parseBlueprint(level.blueprint, columns));
};

const REJECTED = -100;

describe("score", () => {

  it("throws out a level that cannot be finished at all", () => {
    const dead = onGrid(`
      ___
      ___
      ...
    `, "king");

    expect(dead.total).toBeLessThan(REJECTED);
    expect(dead.reasons).toEqual(["unsolvable"]);
  });

  it("throws out a level the board outruns", () => {
    const slow = onGrid(
      Array.from({ length: 40 }, () => "._").join("\n"), "king", { speedUp: 0.8 });

    expect(slow.total).toBeLessThan(REJECTED);
    expect(slow.reasons[0]).toMatch(/planner/);
  });

  it("marks down what it is short of, and says so", () => {
    const flat = onGrid(`
      ...
      ...
      ...
    `, "queen");

    expect(flat.par).toBe(1);
    expect(flat.total).toBeLessThan(0);
    expect(flat.reasons.join(" ")).toContain("par 1");
  });

  // The point of the metric is the price of a mistake, not its finality: a
  // level whose only real mistake ends the run has nothing to weigh.
  it("prices only the mistakes that can be walked back", () => {
    const level = levelBySlug("bad-trade");

    expect(score(level, blueprintOf(level)).worstCost).toBeLessThan(4);
  });

  it("counts the rows that arrive after the run has started", () => {
    const tall = levelBySlug("knight-school");

    expect(score(tall, blueprintOf(tall)).unseen).toBeGreaterThan(0);
  });
});
