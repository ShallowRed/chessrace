import { describe, expect, it } from "vitest";

import { attacks, heldSquares } from "app/level/threat";

import type { Coords, PiecePlacement } from "app/types";

const nothingBlocks = () => false;

const at = (pieceName: PiecePlacement["pieceName"], position: Coords) =>
  ({ pieceName, position });

describe("attacks", () => {

  it("has a rook hold its rank and file", () => {
    const rook = at("rook", [3, 3]);

    expect(attacks(rook, [3, 9], nothingBlocks)).toBe(true);
    expect(attacks(rook, [0, 3], nothingBlocks)).toBe(true);
    expect(attacks(rook, [4, 4], nothingBlocks)).toBe(false);
  });

  it("has a pawn hold the two squares ahead of it, not the one in front", () => {
    const pawn = at("pawn", [3, 3]);

    expect(attacks(pawn, [2, 4], nothingBlocks)).toBe(true);
    expect(attacks(pawn, [4, 4], nothingBlocks)).toBe(true);
    expect(attacks(pawn, [3, 4], nothingBlocks)).toBe(false);
  });

  it("has a knight hold squares it could jump to, through anything", () => {
    const knight = at("knight", [3, 3]);

    expect(attacks(knight, [5, 4], () => true)).toBe(true);
    expect(attacks(knight, [4, 4], () => true)).toBe(false);
  });

  it("cuts a long line at the first thing in the way", () => {
    const bishop = at("bishop", [0, 0]);

    expect(attacks(bishop, [4, 4], nothingBlocks)).toBe(true);
    expect(attacks(bishop, [4, 4], ([col, row]) => col === 2 && row === 2))
      .toBe(false);
  });

  it("does not have a piece hold the square it stands on", () => {
    expect(attacks(at("queen", [3, 3]), [3, 3], nothingBlocks)).toBe(false);
  });
});

describe("heldSquares", () => {

  it("gathers what a board full of enemies covers", () => {
    const held = heldSquares(
      [at("pawn", [1, 1]), at("rook", [5, 0])],
      nothingBlocks,
      8,
      6
    );

    expect(held.has("0_2")).toBe(true);
    expect(held.has("2_2")).toBe(true);
    expect(held.has("5_4")).toBe(true);
    // straight ahead of a pawn is the one square it does not hold, and the
    // rook covers the whole of rank 0, its own square excepted
    expect(held.has("1_2")).toBe(false);
    expect(held.has("5_0")).toBe(false);
    expect(held.has("7_5")).toBe(false);
  });

  it("gathers nothing from an empty board", () => {
    expect(heldSquares([], nothingBlocks, 8, 6).size).toBe(0);
  });
});
