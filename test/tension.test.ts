import { describe, expect, it } from "vitest";

import { blueprintOf, levelBySlug } from "app/level/catalogue";
import { parseLevelGrid } from "app/level/notation";
import { tension, UNWINNABLE } from "app/level/tension";
import { parseBlueprint } from "app/utils/parse-blueprint";

import type { PieceName } from "app/types";

const onGrid = (grid: string, pieceName: PieceName, column = 0) => {
  const columns = (grid.trim().split("\n")[0] ?? "").trim().length;

  return tension(parseBlueprint(parseLevelGrid(grid), columns), columns, {
    position: [column, 0],
    pieceName
  });
};

describe("tension", () => {

  it("finds nothing to weigh in a corridor", () => {
    const { choices, tempting } = onGrid("_._\n_._\n_._", "rook", 1);

    expect(choices).toBe(0);
    expect(tempting).toBe(0);
  });

  it("separates having options from having a decision", () => {
    // wide open: every move is legal, and the worst of them costs nothing
    const wide = onGrid("........\n........\n........", "queen", 3);

    expect(wide.decisions[0]?.options).toBeGreaterThan(10);
    expect(wide.worstRegret).toBeLessThan(2);
  });

  it("prices a detour in the moves it costs", () => {
    // going up the short side of the wall costs the walk back round it
    const { worstRegret } = onGrid(`
      ......
      _____.
      _____.
      _____.
      ......
    `, "king", 0);

    expect(worstRegret).toBeGreaterThanOrEqual(2);
  });

  it("prices a move that cannot be undone as unwinnable", () => {
    // the pawn is a knight's move away and taking it leaves a piece that
    // cannot reach the island above
    const { worstRegret } = onGrid(`
      __.__
      _____
      _.___
      P____
      .....
    `, "knight", 2);

    expect(worstRegret).toBe(UNWINNABLE);
  });
});

describe("what tension says about the catalogue", () => {

  const of = (slug: string) => {
    const level = levelBySlug(slug);

    return tension(blueprintOf(level), level.columns, level.spawn);
  };

  // Taking the bait turns the player into a piece that cannot finish, which is
  // the only kind of mistake this game makes irreversible.
  it("prices the bait levels as unwinnable", () => {
    expect(of("bad-trade").worstRegret).toBeGreaterThan(50);
    expect(of("the-wrong-queen").worstRegret).toBeGreaterThan(50);
  });
});
