import { describe, expect, it } from "vitest";

import { blueprintOf, levelBySlug, levels, randomLevel, slugOf, worlds } from "app/level/catalogue";
import { isBeatable } from "app/level/solve";

import { routesThroughLevel, solveLevel } from "./support";

import type { Level } from "app/level/catalogue";

describe.each(levels)("$name", (level) => {

  const blueprint = blueprintOf(level);

  it("declares dimensions matching its grid", () => {
    expect(blueprint).toHaveLength(level.rows);

    for (const row of blueprint) {
      expect(row).toHaveLength(level.columns);
    }
  });

  it("spawns the player on a solid square inside the board", () => {
    const [col, row] = level.spawn.position;

    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(level.columns);
    expect(blueprint[row]?.[col]).toBe(1);
  });

  it("can be beaten", () => {
    expect(isBeatable(blueprint, level.columns, level.spawn)).toBe(true);
  });
});

describe("the catalogue", () => {

  it("gives every level a distinct name", () => {
    const names = levels.map(({ name }) => name);

    expect(new Set(names).size).toBe(names.length);
  });
});

describe("randomLevel", () => {

  it("builds a level of the asked dimensions", () => {
    const level = randomLevel({ columns: 8, rows: 17 });

    expect(level.columns).toBe(8);
    expect(level.rows).toBe(17);
    expect(level.blueprint).toHaveLength(8 * 17);
  });

  it("can be beaten", () => {
    const level = randomLevel({ columns: 8, rows: 17 });

    expect(isBeatable(
      blueprintOf(level),
      level.columns,
      level.spawn
    )).toBe(true);
  });
});

const named = (name: string) =>
  levels.find(level => level.name === name) as Level;

describe("what the opening levels teach", () => {

  it("Climb asks for nothing but a move or two", () => {
    const solution = solveLevel(named("Climb"));

    expect(solution?.captures).toBe(0);
    expect(solution?.moves.length).toBeLessThanOrEqual(3);
  });

  it("Mind the gap cannot be rushed in a straight line", () => {
    const solution = solveLevel(named("Mind the gap"));

    expect(solution?.captures).toBe(0);
    expect(solution?.moves.length).toBeGreaterThanOrEqual(3);
  });

  it("Take to become cannot be finished in the spawning form", () => {
    const solution = solveLevel(named("Take to become"));

    expect(solution?.captures).toBeGreaterThanOrEqual(2);
    expect(solution?.forms[0]).toBe("pawn");
    expect(solution?.forms.length).toBeGreaterThan(1);
  });

  it("Leap needs the knight, and only the knight", () => {
    const leap = named("Leap");

    expect(solveLevel(leap)?.forms).toEqual(["knight"]);

    for (const pieceName of ["queen", "rook", "bishop", "king", "pawn"] as const) {
      expect(solveLevel(leap, { position: leap.spawn.position, pieceName }))
        .toBeNull();
    }
  });

  it("Blocked line has to be opened by a capture", () => {
    expect(solveLevel(named("Blocked line"))?.captures)
      .toBeGreaterThanOrEqual(1);
  });

  it("Bad trade is won by leaving the pawn alone, and lost by taking it", () => {
    const badTrade = named("Bad trade");

    expect(solveLevel(badTrade)?.captures).toBe(0);

    expect(solveLevel(badTrade, { position: [3, 1], pieceName: "pawn" }))
      .toBeNull();
  });
});

describe("past the teaching world", () => {

  const later = worlds.slice(1).flatMap(({ levels }) => levels);

  // The catalogue used to look hard and play loose: its widest level admitted
  // 999 shortest routes. A level earns its place by being both long enough to
  // plan and narrow enough that the plan matters.
  it.each(later)("$name asks for a route worth planning", (level) => {
    expect(solveLevel(level)?.moves.length).toBeGreaterThanOrEqual(5);
    expect(routesThroughLevel(level)).toBeLessThanOrEqual(24);
  });

  it("walks the gauntlet through every form it hands out", () => {
    expect(solveLevel(named("The gauntlet"))?.forms)
      .toEqual(["queen", "rook", "knight", "bishop"]);
  });

  it("makes Toll spend the queen it starts with", () => {
    expect(solveLevel(named("Toll"))?.forms)
      .toEqual(["queen", "knight", "pawn", "knight"]);
  });

  it("strands the player who takes the wrong queen", () => {
    const level = named("The wrong queen");

    expect(solveLevel(level)?.captures).toBe(0);
    expect(solveLevel(level, { position: [4, 2], pieceName: "queen" })).toBeNull();
  });
});

describe("guidance", () => {

  it("gives each opening level a hint naming what it teaches", () => {
    for (const level of worlds[0]!.levels) {
      expect(level.hint).toBeTruthy();
    }
  });

  it("leaves the later worlds unhinted", () => {
    for (const world of worlds.slice(1)) {
      for (const level of world.levels) {
        expect(level.hint).toBeUndefined();
      }
    }
  });
});

describe("picking a level by slug", () => {

  it("gives every level a distinct slug", () => {
    const slugs = levels.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("slugifies a name", () => {
    expect(slugOf("Pawn's promise")).toBe("pawn-s-promise");
  });

  it("finds a level by its slug", () => {
    expect(levelBySlug("blind-corner").name).toBe("Blind corner");
  });

  it("falls back to the first level when the slug is unknown or missing", () => {
    expect(levelBySlug("nope")).toBe(levels[0]);
    expect(levelBySlug(null)).toBe(levels[0]);
  });
});

describe("the catalogue as a whole", () => {

  it.each(levels)("$name is never won in a single move", (level) => {
    expect(solveLevel(level)?.moves.length).toBeGreaterThan(1);
  });
});
