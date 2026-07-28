import { describe, expect, it } from "vitest";

import { isBeatable } from "app/level/solve";
import { levels, randomLevel } from "app/level/levels";
import { parseBlueprint } from "app/utils/parse-blueprint";

describe.each(levels)("$name", (level) => {

  const blueprint = parseBlueprint(level.blueprint, level.columns);

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
      parseBlueprint(level.blueprint, level.columns),
      level.columns,
      level.spawn
    )).toBe(true);
  });
});
