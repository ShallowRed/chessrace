import { describe, expect, it } from "vitest";

import { isBeatable, solve } from "app/level/solve";
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

describe("solve", () => {

  const solveGrid = (grid: string, pieceName: PieceName, column = 0) => {

    const columns = (grid.trim().split("\n")[0] ?? "").trim().length;

    return solve(parseBlueprint(parseLevelGrid(grid), columns), columns, {
      position: [column, 0],
      pieceName
    });
  };

  it("returns the squares the player lands on, finish line included", () => {
    const solution = solveGrid(`
      ...
      ...
    `, "rook", 0);

    expect(solution?.moves).toEqual([[0, 2]]);
  });

  it("returns the shortest route", () => {
    const solution = solveGrid(`
      ..._
      _...
      ...R
    `, "king", 0);

    expect(solution?.moves).toHaveLength(3);
  });

  it("reports the sequence of forms and the captures behind it", () => {
    const solution = solveGrid(`
      ...
      _..
      .R.
      ...
    `, "pawn", 0);

    expect(solution?.forms).toEqual(["pawn", "rook"]);
    expect(solution?.captures).toBe(1);
  });

  it("returns null when the finish line cannot be reached", () => {
    expect(solveGrid(`
      ...
      ___
      ...
    `, "queen", 1)).toBeNull();
  });
});
