import { describe, expect, it } from "vitest";

import { arrayIncludesArray } from "app/utils/array-includes-array";

describe("arrayIncludesArray", () => {

  const includes = arrayIncludesArray([[0, 0], [1, 2], [3, 4]]);

  it("matches on coordinates rather than array identity", () => {
    expect(includes([1, 2])).toBe(true);
    expect(includes([3, 4])).toBe(true);
  });

  it("rejects absent coordinates", () => {
    expect(includes([2, 1])).toBe(false);
    expect(includes([9, 9])).toBe(false);
  });

  it("tells [1, 2] and [2, 1] apart", () => {
    expect(includes([1, 2])).toBe(true);
    expect(includes([2, 1])).toBe(false);
  });

  it("handles an empty list", () => {
    expect(arrayIncludesArray([])([0, 0])).toBe(false);
  });
});
