import { describe, expect, it } from "vitest";

import { routesThroughGrid, solveGrid } from "./support";

const open = (rows: number) =>
  Array.from({ length: rows }, () => "........").join("\n");

describe("countRoutes", () => {

  it("counts the single route through a corridor", () => {
    expect(routesThroughGrid("_._\n_._\n_._", "rook", 1)).toBe(1);
  });

  it("counts a pawn's walk as the one route it is", () => {
    expect(routesThroughGrid(open(2), "pawn", 1)).toBe(1);
  });

  it("counts the ways round an obstacle", () => {
    const grid = "...\n._.\n...";

    expect(solveGrid(grid, "king", 1)?.moves).toHaveLength(3);
    expect(routesThroughGrid(grid, "king", 1)).toBe(10);
  });

  it("grows fast with room to move", () => {
    expect(routesThroughGrid(open(3), "king", 3)).toBe(27);
    expect(routesThroughGrid(open(6), "king", 3)).toBe(686);
  });

  // Read alone the count misleads: an open board lets a queen finish in one
  // move, which is few routes and no challenge at all. It only means anything
  // next to the length of that shortest route.
  it("is low for a board that is over at once", () => {
    expect(solveGrid(open(4), "queen", 3)?.moves).toHaveLength(1);
    expect(routesThroughGrid(open(4), "queen", 3)).toBe(2);
  });

  it("counts nothing when the finishing line cannot be reached", () => {
    expect(routesThroughGrid("...\n___\n...", "queen", 1)).toBe(0);
  });
});
