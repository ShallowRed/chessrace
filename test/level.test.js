import { beforeEach, describe, expect, it } from "vitest";

import LevelModel from "app/level/level";

// 4 colonnes x 3 rangées.
//   rangée 0 : ....      (que des cases pleines)
//   rangée 1 : .O..      (un trou en colonne 1)
//   rangée 2 : ..N.      (un cavalier en colonne 2 — valeur 4)
const BLUEPRINT = "1111" + "1011" + "1141";

const newModel = ({ visibleRows = 2 } = {}) =>
  new LevelModel(BLUEPRINT, { columns: 4, rows: 3, visibleRows });

describe("LevelModel — lecture du plateau", () => {

  let model;

  beforeEach(() => {
    model = newModel();
  });

  it("expose le niveau comme une grille de nombres", () => {
    expect(model.blueprint).toEqual([
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 4, 1]
    ]);
  });

  it("reconnaît un trou", () => {
    expect(model.square.isHole([1, 1])).toBe(true);
    expect(model.square.isHole([0, 1])).toBe(false);
  });

  it("reconnaît une case occupée par un ennemi", () => {
    expect(model.square.isEnnemy([2, 2])).toBe(true);
    expect(model.square.isEnnemy([0, 0])).toBe(false);
  });

  it("considère trous et ennemis comme des obstacles", () => {
    expect(model.square.isObstacle([1, 1])).toBe(true);
    expect(model.square.isObstacle([2, 2])).toBe(true);
    expect(model.square.isObstacle([0, 0])).toBe(false);
  });

  it("place la ligne d'arrivée juste au-delà de la dernière rangée", () => {
    // `rows` vaut 3, donc les rangées du plateau vont de 0 à 2 ; la rangée 3
    // est la ligne d'arrivée, dans le plateau mais hors du blueprint.
    expect(model.square.isInBoard([0, 3])).toBe(true);
    expect(model.square.isInBoard([0, 4])).toBe(false);

    expect(model.square.isHole([0, 3])).toBe(false);
    expect(model.square.isEnnemy([0, 3])).toBe(false);
  });

  it("rejette ce qui sort du plateau par les côtés ou par le bas", () => {
    expect(model.square.isInBoard([-1, 0])).toBe(false);
    expect(model.square.isInBoard([4, 0])).toBe(false);
    expect(model.square.isInBoard([0, -1])).toBe(false);
  });
});

describe("LevelModel — production des rangées", () => {

  it("ne renvoie que les cases pleines, jamais les trous", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.regularSquares).toHaveLength(11);
    expect(model.regularSquares).not.toContainEqual([1, 1]);
    expect(model.regularSquares).toContainEqual([1, 0]);
  });

  it("extrait les ennemis avec leur nom de pièce et leur position", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.newEnnemyPieces).toEqual([
      { pieceName: "knight", position: [2, 2] }
    ]);
  });

  it("garde la case d'un ennemi parmi les cases pleines", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.regularSquares).toContainEqual([2, 2]);
  });

  it("ne signale un ennemi qu'une fois", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();
    model.parseNextRows();

    expect(model.newEnnemyPieces).toEqual([]);
  });

  it("s'arrête à la dernière rangée du niveau", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.lastRowRendered).toBe(2);

    model.parseNextRows();

    expect(model.lastRowRendered).toBe(2);
  });

  it("fait glisser sa fenêtre au fil du défilement", () => {
    const tall = new LevelModel("11".repeat(5), { columns: 2, rows: 5, visibleRows: 1 });

    tall.reset();
    tall.parseNextRows();

    const rowsOf = () => tall.deepRegularSquares
      .map(([[, row]]) => row);

    expect(rowsOf()).toEqual([0, 1, 2]);

    tall.parseNextRows();

    expect(rowsOf()).toEqual([1, 2, 3]);

    tall.parseNextRows();

    expect(rowsOf()).toEqual([2, 3, 4]);
  });

  it("repart de zéro après un reset", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();
    model.reset();

    expect(model.lastRowRendered).toBe(-1);
    expect(model.deepRegularSquares).toEqual([]);
  });
});
