import { describe, expect, it } from "vitest";

import { mirror, patterns, shift, stack } from "app/level/patterns";

import { PIECE_NAMES } from "app/types";

import { solveGridFromAnywhere } from "./support";

import type { PieceName } from "app/types";

const SPAWN_ROW = "........";

const COLUMNS = 8;

const crossings = (grid: string, pieceName: PieceName) =>
  solveGridFromAnywhere(stack(grid, SPAWN_ROW), pieceName);

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

describe("shift", () => {

  it("slides a fragment sideways and backfills with holes", () => {
    expect(shift("...\n.R.", 1)).toBe("_..\n_.R");
    expect(shift("...\n.R.", -1)).toBe(".._\nR._");
  });

  it("leaves a fragment alone at offset zero", () => {
    expect(shift("._.\nR..", 0)).toBe("._.\nR..");
  });
});

describe("mirror", () => {

  it("flips a fragment left to right", () => {
    expect(mirror("__.\n.R_")).toBe(".__\n_R.");
  });
});
