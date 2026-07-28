import { describe, expect, it } from "vitest";

import {
  isLongRange,
  isValidMove,
  isValidTake
} from "app/game-objects/pieces/models/pieces-movements";

const at = (pieceName, position) => ({ pieceName, position });

describe("isValidMove", () => {

  describe("pion", () => {

    it("avance d'une case tout droit", () => {
      expect(isValidMove(at("pawn", [3, 0]), [3, 1])).toBe(true);
    });

    it("ne recule pas, ne saute pas, ne va pas de côté", () => {
      expect(isValidMove(at("pawn", [3, 1]), [3, 0])).toBe(false);
      expect(isValidMove(at("pawn", [3, 0]), [3, 2])).toBe(false);
      expect(isValidMove(at("pawn", [3, 0]), [4, 0])).toBe(false);
    });

    it("ne prend pas tout droit, mais prend en diagonale", () => {
      expect(isValidTake(at("pawn", [3, 0]), [3, 1])).toBe(false);
      expect(isValidTake(at("pawn", [3, 0]), [2, 1])).toBe(true);
      expect(isValidTake(at("pawn", [3, 0]), [4, 1])).toBe(true);
    });
  });

  describe("roi", () => {

    it("va sur n'importe quelle case adjacente", () => {
      for (const target of [[2, 0], [4, 0], [3, 1], [2, 1], [4, 1]]) {
        expect(isValidMove(at("king", [3, 0]), target)).toBe(true);
      }
    });

    it("ne va pas à deux cases", () => {
      expect(isValidMove(at("king", [3, 0]), [5, 0])).toBe(false);
      expect(isValidMove(at("king", [3, 0]), [3, 2])).toBe(false);
    });
  });

  describe("cavalier", () => {

    it("saute en L, dans les huit directions", () => {
      const targets = [
        [5, 6], [5, 2], [3, 6], [3, 2],
        [6, 5], [6, 3], [2, 5], [2, 3]
      ];

      for (const target of targets) {
        expect(isValidMove(at("knight", [4, 4]), target)).toBe(true);
      }
    });

    it("ne se déplace ni en ligne ni en diagonale", () => {
      expect(isValidMove(at("knight", [4, 4]), [4, 6])).toBe(false);
      expect(isValidMove(at("knight", [4, 4]), [6, 6])).toBe(false);
    });
  });

  describe("fou", () => {

    it("se déplace en diagonale, à n'importe quelle distance", () => {
      expect(isValidMove(at("bishop", [0, 0]), [5, 5])).toBe(true);
      expect(isValidMove(at("bishop", [5, 5]), [2, 2])).toBe(true);
      expect(isValidMove(at("bishop", [5, 0]), [0, 5])).toBe(true);
    });

    it("ne se déplace pas en ligne", () => {
      expect(isValidMove(at("bishop", [0, 0]), [0, 3])).toBe(false);
      expect(isValidMove(at("bishop", [0, 0]), [3, 0])).toBe(false);
    });
  });

  describe("tour", () => {

    it("se déplace en ligne, à n'importe quelle distance", () => {
      expect(isValidMove(at("rook", [0, 0]), [0, 7])).toBe(true);
      expect(isValidMove(at("rook", [0, 0]), [7, 0])).toBe(true);
    });

    it("ne se déplace pas en diagonale", () => {
      expect(isValidMove(at("rook", [0, 0]), [3, 3])).toBe(false);
    });
  });

  describe("dame", () => {

    it("cumule les déplacements de la tour et du fou", () => {
      expect(isValidMove(at("queen", [3, 0]), [3, 7])).toBe(true);
      expect(isValidMove(at("queen", [3, 0]), [7, 0])).toBe(true);
      expect(isValidMove(at("queen", [3, 0]), [6, 3])).toBe(true);
    });

    it("ne se déplace pas en L", () => {
      expect(isValidMove(at("queen", [3, 0]), [4, 2])).toBe(false);
    });
  });
});

describe("isValidTake", () => {

  it("retombe sur isValidMove pour toute pièce sans prise spécifique", () => {
    for (const pieceName of ["king", "knight", "bishop", "rook", "queen"]) {
      const from = at(pieceName, [4, 4]);

      for (const target of [[5, 5], [4, 6], [6, 5], [2, 2]]) {
        expect(isValidTake(from, target))
          .toBe(isValidMove(from, target));
      }
    }
  });
});

describe("isLongRange", () => {

  it("est vrai pour les pièces qui traversent des cases", () => {
    expect(isLongRange("bishop")).toBe(true);
    expect(isLongRange("rook")).toBe(true);
    expect(isLongRange("queen")).toBe(true);
  });

  it("est faux pour les pièces qui ne traversent rien", () => {
    expect(isLongRange("pawn")).toBeFalsy();
    expect(isLongRange("king")).toBeFalsy();
    expect(isLongRange("knight")).toBeFalsy();
  });
});

describe("coup nul (case de départ = case d'arrivée)", () => {

  // Comportement actuel, documenté ici parce qu'il n'est pas anodin :
  // toutes les pièces sauf le pion et le cavalier considèrent leur propre
  // case comme une destination valide. Le jeu ne le laisse pas voir, le
  // sprite du joueur interceptant le clic sur sa propre case — mais la règle
  // est bien permissive. Voir aussi get-squares-on-trajectory.test.js.
  it("est accepté par le roi et les pièces à longue portée", () => {
    for (const pieceName of ["king", "bishop", "rook", "queen"]) {
      expect(isValidMove(at(pieceName, [3, 3]), [3, 3])).toBe(true);
    }
  });

  it("est refusé par le pion et le cavalier", () => {
    for (const pieceName of ["pawn", "knight"]) {
      expect(isValidMove(at(pieceName, [3, 3]), [3, 3])).toBe(false);
    }
  });
});
