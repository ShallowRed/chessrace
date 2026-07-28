import { describe, expect, it } from "vitest";

import { generateLevelBlueprint } from "app/utils/level-generator";
import { parseBlueprint } from "app/utils/parse-blueprint";

const DIMENSIONS = { columns: 8, rows: 17 };

const generateRows = () =>
  parseBlueprint(generateLevelBlueprint(DIMENSIONS), DIMENSIONS.columns);

describe("generateLevelBlueprint", () => {

  it("yields one digit per square", () => {
    const blueprint = generateLevelBlueprint(DIMENSIONS);

    expect(blueprint).toHaveLength(8 * 17);
    expect(blueprint).toMatch(/^[0-7]+$/);
  });

  it("always leaves column 3 walkable, so the level stays beatable", () => {
    for (let attempt = 0; attempt < 50; attempt++) {
      for (const row of generateRows()) {
        expect(row[3]).toBe(1);
      }
    }
  });

  it("always leaves the first four rows solid", () => {
    for (let attempt = 0; attempt < 50; attempt++) {
      for (const row of generateRows().slice(0, 4)) {
        expect(row).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
      }
    }
  });

  it("digs holes and drops pieces past the first four rows", () => {
    const values = new Set(
      generateLevelBlueprint({ columns: 8, rows: 400 }).split("")
    );

    expect(values.has("0")).toBe(true);
    expect([...values].some((value) => Number(value) > 1)).toBe(true);
  });
});
