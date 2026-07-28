import { describe, expect, it } from "vitest";

import { isBeatable } from "app/level/is-beatable";
import { parseLevelGrid } from "app/level/level-notation";
import { parseBlueprint } from "app/utils/parse-blueprint";

import type { PieceName } from "app/types";

const beatable = (grid: string, pieceName: PieceName, column = 0) => {

  const columns = (grid.trim().split("\n")[0] ?? "").trim().length;

  const blueprint = parseBlueprint(parseLevelGrid(grid), columns);

  return isBeatable(blueprint, columns, { position: [column, 0], pieceName });
};

describe("isBeatable", () => {

  it("accepts an open board", () => {
    expect(beatable(`
      ...
      ...
      ...
    `, "queen", 1)).toBe(true);
  });

  it("rejects a board walled off by holes", () => {
    expect(beatable(`
      ...
      ___
      ...
    `, "queen", 1)).toBe(false);
  });

  it("lets a knight jump over a wall of holes", () => {
    expect(beatable(`
      ...
      ___
      ...
    `, "knight", 1)).toBe(true);
  });

  it("stops a rook from crossing a hole", () => {
    expect(beatable(`
      .._
      __.
      ..R
    `, "rook", 0)).toBe(false);
  });

  it("stops a bishop from crossing an enemy", () => {
    expect(beatable(`
      __.
      _._
      ...
    `, "bishop", 0)).toBe(true);

    expect(beatable(`
      __.
      _R_
      ...
    `, "bishop", 0)).toBe(false);
  });

  it("lets a pawn promote itself by taking a piece", () => {
    expect(beatable(`
      ...
      _..
      .R.
      ...
    `, "pawn", 0)).toBe(true);

    expect(beatable(`
      ...
      _..
      ...
      ...
    `, "pawn", 0)).toBe(false);
  });

  it("keeps a lone pawn walled in behind a piece it cannot take", () => {
    expect(beatable(`
      ___
      _R_
      ___
      ...
    `, "pawn", 1)).toBe(false);
  });
});
