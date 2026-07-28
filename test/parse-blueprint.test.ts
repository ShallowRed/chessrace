import { describe, expect, it } from "vitest";

import { parseBlueprint } from "app/utils/parse-blueprint";

describe("parseBlueprint", () => {

  it("splits the level string into rows of `columns` numbers", () => {
    expect(parseBlueprint("111110111141", 4)).toEqual([
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 4, 1]
    ]);
  });

  it("preserves row and column order", () => {
    const blueprint = parseBlueprint("012345", 3);

    expect(blueprint[0]).toEqual([0, 1, 2]);
    expect(blueprint[1]).toEqual([3, 4, 5]);
  });

  it("yields numbers, not strings", () => {
    for (const value of parseBlueprint("1010", 2).flat()) {
      expect(typeof value).toBe("number");
    }
  });

  it("tolerates a short last row", () => {
    expect(parseBlueprint("11111", 4)).toEqual([
      [1, 1, 1, 1],
      [1]
    ]);
  });
});
