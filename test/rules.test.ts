import { describe, expect, it } from "vitest";

import { parseLevelGrid } from "app/level/notation";
import { readRules } from "app/level/rules";
import { parseBlueprint } from "app/utils/parse-blueprint";

import { widthOf } from "./support";

import type { Standing } from "app/level/rules";
import type { Coords, PieceName } from "app/types";

const rulesOf = (grid: string) => {
  const columns = widthOf(grid);

  return readRules(parseBlueprint(parseLevelGrid(grid), columns), columns);
};

const at = (pieceName: PieceName, position: Coords): Standing =>
  ({ pieceName, position, taken: "" });

describe("what a click means", () => {

  const board = rulesOf(`
    ....
    _.N.
    ....
  `);

  it("is a move onto an empty square", () => {
    expect(board.resolve(at("rook", [1, 0]), [1, 1]))
      .toEqual({ kind: "move", to: [1, 1] });
  });

  it("is a capture onto an enemy, and says what you become", () => {
    expect(board.resolve(at("rook", [2, 0]), [2, 1]))
      .toEqual({ kind: "capture", to: [2, 1], becomes: "knight" });
  });

  it("is illegal when the piece cannot go there at all", () => {
    expect(board.resolve(at("rook", [1, 0]), [2, 2]).kind).toBe("illegal");
  });

  it("is illegal off the board, and onto the square already stood on", () => {
    expect(board.resolve(at("rook", [1, 0]), [1, 0]).kind).toBe("illegal");
    expect(board.resolve(at("rook", [1, 0]), [-1, 0]).kind).toBe("illegal");
  });

  it("is death onto a hole", () => {
    expect(board.resolve(at("rook", [0, 0]), [0, 1]))
      .toEqual({ kind: "death", at: [0, 1], cause: "hole" });
  });

  // The line dies where it breaks, which is not always where it was aimed.
  it("is death at the first hole crossed, not at the square clicked", () => {
    const long = rulesOf(`
      ....
      _...
      _...
      ....
    `);

    expect(long.resolve(at("rook", [0, 0]), [0, 3]))
      .toEqual({ kind: "death", at: [0, 1], cause: "hole" });
  });

  it("is illegal through a square an enemy holds", () => {
    const watched = rulesOf(`
      ......
      ......
      ...R..
      ......
      ......
    `);

    expect(watched.resolve(at("rook", [0, 0]), [0, 4]).kind).toBe("illegal");
  });
});

describe("the moves the solver walks", () => {

  it("are exactly the clicks that go somewhere", () => {
    const board = rulesOf(`
      ...
      _N.
      ...
    `);

    const from = at("king", [1, 0]);

    const reached = board.movesFrom(from).map(({ position }) => position);

    for (const target of reached) {
      expect(["move", "capture"]).toContain(board.resolve(from, target).kind);
    }

    // the hole at [0,1] is a legal click and a fatal one, so it is not a move
    expect(board.resolve(from, [0, 1]).kind).toBe("death");
    expect(reached).not.toContainEqual([0, 1]);
  });

  it("carry the form a capture hands over", () => {
    const board = rulesOf(`
      ...
      .N.
      ...
    `);

    const taken = board.movesFrom(at("king", [1, 0]))
      .find(({ position }) => position[0] === 1 && position[1] === 1);

    expect(taken?.pieceName).toBe("knight");
    expect(taken?.taken).toBe("1_1");
  });
});
