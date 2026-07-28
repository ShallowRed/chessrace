import { describe, expect, it } from "vitest";

import { parseLevelGrid } from "app/level/level-notation";
import { patterns, stack } from "app/level/patterns";
import { solve } from "app/level/solve";
import { parseBlueprint } from "app/utils/parse-blueprint";

import { PIECE_NAMES } from "app/types";

import type { Solution } from "app/level/solve";
import type { PieceName } from "app/types";

const SPAWN_ROW = "........";

const COLUMNS = 8;

const crossings = (grid: string, pieceName: PieceName): Solution[] => {

  const blueprint = parseBlueprint(parseLevelGrid(stack(grid, SPAWN_ROW)), COLUMNS);

  return Array
    .from({ length: COLUMNS }, (_none, column) =>
      solve(blueprint, COLUMNS, { position: [column, 0], pieceName }))
    .filter((solution): solution is Solution => solution !== null);
};

describe.each(patterns)("$name", (subject) => {

  it("is eight squares wide on every row", () => {
    for (const row of subject.grid.split("\n").map(r => r.trim()).filter(Boolean)) {
      expect(row).toHaveLength(COLUMNS);
    }
  });

  it("is crossed by exactly the declared pieces", () => {
    const crossed = PIECE_NAMES.filter(pieceName =>
      crossings(subject.grid, pieceName).length > 0);

    expect([...crossed].sort()).toEqual([...subject.crossableBy].sort());
  });
});

describe("ladder", () => {

  it("costs every form at least two captures", () => {
    const ladder = patterns.find(({ name }) => name === "ladder");

    for (const pieceName of PIECE_NAMES) {
      const cheapest = Math.min(...crossings(ladder?.grid ?? "", pieceName)
        .map(({ captures }) => captures));

      expect(cheapest).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("stack", () => {

  it("lays fragments out top down and trims the indentation", () => {
    expect(stack("\n  ab\n  cd\n", "  ef  ")).toBe("ab\ncd\nef");
  });
});
