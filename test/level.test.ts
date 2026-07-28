import { beforeEach, describe, expect, it } from "vitest";

import LevelModel from "app/level/level";

// row 0: no hole - row 1: hole in column 1 - row 2: knight in column 2
const BLUEPRINT = "1111" + "1011" + "1141";

const newModel = ({ visibleRows = 2 } = {}) =>
  new LevelModel(BLUEPRINT, { columns: 4, rows: 3, visibleRows });

describe("reading the board", () => {

  let model: LevelModel;

  beforeEach(() => {
    model = newModel();
  });

  it("exposes the level as a grid of numbers", () => {
    expect(model.blueprint).toEqual([
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 4, 1]
    ]);
  });

  it("recognises a hole", () => {
    expect(model.square.isHole([1, 1])).toBe(true);
    expect(model.square.isHole([0, 1])).toBe(false);
  });

  it("recognises a square held by an enemy", () => {
    expect(model.square.isEnemy([2, 2])).toBe(true);
    expect(model.square.isEnemy([0, 0])).toBe(false);
  });

  it("treats holes and enemies as obstacles", () => {
    expect(model.square.isObstacle([1, 1])).toBe(true);
    expect(model.square.isObstacle([2, 2])).toBe(true);
    expect(model.square.isObstacle([0, 0])).toBe(false);
  });

  it("puts the finishing line one row past the last one", () => {
    expect(model.square.isInBoard([0, 3])).toBe(true);
    expect(model.square.isInBoard([0, 4])).toBe(false);

    expect(model.square.isHole([0, 3])).toBe(false);
    expect(model.square.isEnemy([0, 3])).toBe(false);
  });

  it("rejects anything off the board", () => {
    expect(model.square.isInBoard([-1, 0])).toBe(false);
    expect(model.square.isInBoard([4, 0])).toBe(false);
    expect(model.square.isInBoard([0, -1])).toBe(false);
  });
});

describe("producing rows", () => {

  it("yields solid squares only, never holes", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.regularSquares).toHaveLength(11);
    expect(model.regularSquares).not.toContainEqual([1, 1]);
    expect(model.regularSquares).toContainEqual([1, 0]);
  });

  it("extracts enemies with their piece name and position", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.newEnemyPieces).toEqual([
      { pieceName: "knight", position: [2, 2] }
    ]);
  });

  it("keeps the square an enemy stands on among the solid ones", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.regularSquares).toContainEqual([2, 2]);
  });

  it("reports an enemy once only", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();
    model.parseNextRows();

    expect(model.newEnemyPieces).toEqual([]);
  });

  it("stops at the last row of the level", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();

    expect(model.lastRowRendered).toBe(2);

    model.parseNextRows();

    expect(model.lastRowRendered).toBe(2);
  });

  it("slides its window as the board scrolls", () => {
    const tall = new LevelModel("11".repeat(5), { columns: 2, rows: 5, visibleRows: 1 });

    tall.reset();
    tall.parseNextRows();

    const rowsOf = () => tall.deepRegularSquares.map(rows => rows[0]?.[1]);

    expect(rowsOf()).toEqual([0, 1, 2]);

    tall.parseNextRows();

    expect(rowsOf()).toEqual([1, 2, 3]);

    tall.parseNextRows();

    expect(rowsOf()).toEqual([2, 3, 4]);
  });

  it("starts over after a reset", () => {
    const model = newModel();

    model.reset();
    model.parseNextRows();
    model.reset();

    expect(model.lastRowRendered).toBe(-1);
    expect(model.deepRegularSquares).toEqual([]);
  });
});
