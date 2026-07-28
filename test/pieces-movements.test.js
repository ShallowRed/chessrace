import { describe, expect, it } from "vitest";

import {
  isLongRange,
  isValidMove,
  isValidTake
} from "app/game-objects/pieces/models/pieces-movements";

const at = (pieceName, position) => ({ pieceName, position });

describe("pawn", () => {

  it("moves one square straight ahead", () => {
    expect(isValidMove(at("pawn", [3, 0]), [3, 1])).toBe(true);
  });

  it("never moves backwards, sideways or two squares at once", () => {
    expect(isValidMove(at("pawn", [3, 1]), [3, 0])).toBe(false);
    expect(isValidMove(at("pawn", [3, 0]), [3, 2])).toBe(false);
    expect(isValidMove(at("pawn", [3, 0]), [4, 0])).toBe(false);
  });

  it("takes diagonally but not straight ahead", () => {
    expect(isValidTake(at("pawn", [3, 0]), [3, 1])).toBe(false);
    expect(isValidTake(at("pawn", [3, 0]), [2, 1])).toBe(true);
    expect(isValidTake(at("pawn", [3, 0]), [4, 1])).toBe(true);
  });
});

describe("king", () => {

  it("moves to any adjacent square", () => {
    for (const target of [[2, 0], [4, 0], [3, 1], [2, 1], [4, 1]]) {
      expect(isValidMove(at("king", [3, 0]), target)).toBe(true);
    }
  });

  it("never moves two squares away", () => {
    expect(isValidMove(at("king", [3, 0]), [5, 0])).toBe(false);
    expect(isValidMove(at("king", [3, 0]), [3, 2])).toBe(false);
  });
});

describe("knight", () => {

  it("jumps in an L in all eight directions", () => {
    const targets = [
      [5, 6], [5, 2], [3, 6], [3, 2],
      [6, 5], [6, 3], [2, 5], [2, 3]
    ];

    for (const target of targets) {
      expect(isValidMove(at("knight", [4, 4]), target)).toBe(true);
    }
  });

  it("never moves in a line or a diagonal", () => {
    expect(isValidMove(at("knight", [4, 4]), [4, 6])).toBe(false);
    expect(isValidMove(at("knight", [4, 4]), [6, 6])).toBe(false);
  });
});

describe("bishop", () => {

  it("moves any distance along a diagonal", () => {
    expect(isValidMove(at("bishop", [0, 0]), [5, 5])).toBe(true);
    expect(isValidMove(at("bishop", [5, 5]), [2, 2])).toBe(true);
    expect(isValidMove(at("bishop", [5, 0]), [0, 5])).toBe(true);
  });

  it("never moves in a line", () => {
    expect(isValidMove(at("bishop", [0, 0]), [0, 3])).toBe(false);
    expect(isValidMove(at("bishop", [0, 0]), [3, 0])).toBe(false);
  });
});

describe("rook", () => {

  it("moves any distance along a line", () => {
    expect(isValidMove(at("rook", [0, 0]), [0, 7])).toBe(true);
    expect(isValidMove(at("rook", [0, 0]), [7, 0])).toBe(true);
  });

  it("never moves along a diagonal", () => {
    expect(isValidMove(at("rook", [0, 0]), [3, 3])).toBe(false);
  });
});

describe("queen", () => {

  it("combines rook and bishop moves", () => {
    expect(isValidMove(at("queen", [3, 0]), [3, 7])).toBe(true);
    expect(isValidMove(at("queen", [3, 0]), [7, 0])).toBe(true);
    expect(isValidMove(at("queen", [3, 0]), [6, 3])).toBe(true);
  });

  it("never jumps in an L", () => {
    expect(isValidMove(at("queen", [3, 0]), [4, 2])).toBe(false);
  });
});

describe("isValidTake", () => {

  it("falls back to isValidMove for every piece but the pawn", () => {
    for (const pieceName of ["king", "knight", "bishop", "rook", "queen"]) {
      const piece = at(pieceName, [4, 4]);

      for (const target of [[5, 5], [4, 6], [6, 5], [2, 2]]) {
        expect(isValidTake(piece, target))
          .toBe(isValidMove(piece, target));
      }
    }
  });
});

describe("isLongRange", () => {

  it("is true for the pieces that travel across squares", () => {
    expect(isLongRange("bishop")).toBe(true);
    expect(isLongRange("rook")).toBe(true);
    expect(isLongRange("queen")).toBe(true);
  });

  it("is falsy for the pieces that travel across nothing", () => {
    expect(isLongRange("pawn")).toBeFalsy();
    expect(isLongRange("king")).toBeFalsy();
    expect(isLongRange("knight")).toBeFalsy();
  });
});

describe("null move", () => {

  it("is accepted by the king and the long range pieces", () => {
    for (const pieceName of ["king", "bishop", "rook", "queen"]) {
      expect(isValidMove(at(pieceName, [3, 3]), [3, 3])).toBe(true);
    }
  });

  it("is rejected by the pawn and the knight", () => {
    for (const pieceName of ["pawn", "knight"]) {
      expect(isValidMove(at(pieceName, [3, 3]), [3, 3])).toBe(false);
    }
  });
});
