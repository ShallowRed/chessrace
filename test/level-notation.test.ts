import { describe, expect, it } from "vitest";

import { parseLevelGrid } from "app/level/level-notation";
import { parseBlueprint } from "app/utils/parse-blueprint";

describe("parseLevelGrid", () => {

  it("reads a grid top down and stores it bottom up", () => {
    expect(parseLevelGrid(`
      ....
      ..N.
      ....
    `)).toBe("1111" + "1141" + "1111");
  });

  it("turns dots into squares and underscores into holes", () => {
    expect(parseLevelGrid("._._")).toBe("1010");
  });

  it("maps every piece symbol to its blueprint value", () => {
    expect(parseLevelGrid("BKNPQR")).toBe("234567");
  });

  it("ignores blank lines and indentation", () => {
    expect(parseLevelGrid("\n\n   ..  \n\n   ..  \n")).toBe("1111");
  });

  it("round trips through parseBlueprint", () => {
    const blueprint = parseBlueprint(parseLevelGrid(`
      _..Q
      ....
    `), 4);

    expect(blueprint).toEqual([
      [1, 1, 1, 1],
      [0, 1, 1, 6]
    ]);
  });

  it("rejects a ragged grid", () => {
    expect(() => parseLevelGrid("....\n..")).toThrow(/4 squares wide/);
  });

  it("rejects an unknown symbol", () => {
    expect(() => parseLevelGrid("..X.")).toThrow(/unknown level symbol/);
  });

  it("rejects an empty grid", () => {
    expect(() => parseLevelGrid("   \n\n  ")).toThrow(/at least one row/);
  });
});
