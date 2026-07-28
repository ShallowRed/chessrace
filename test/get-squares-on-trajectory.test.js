import { describe, expect, it } from "vitest";

import { getSquaresOnTrajectory } from "app/utils/get-squares-on-trajectory";

describe("getSquaresOnTrajectory", () => {

  it("lists the squares a rook travels across", () => {
    expect(getSquaresOnTrajectory([3, 0], [3, 4]))
      .toEqual([[3, 1], [3, 2], [3, 3]]);

    expect(getSquaresOnTrajectory([0, 2], [4, 2]))
      .toEqual([[1, 2], [2, 2], [3, 2]]);
  });

  it("lists the squares a bishop travels across", () => {
    expect(getSquaresOnTrajectory([0, 0], [3, 3]))
      .toEqual([[1, 1], [2, 2]]);
  });

  it("works in all four directions", () => {
    expect(getSquaresOnTrajectory([4, 4], [1, 1]))
      .toEqual([[3, 3], [2, 2]]);

    expect(getSquaresOnTrajectory([4, 4], [1, 7]))
      .toEqual([[3, 5], [2, 6]]);
  });

  it("returns nothing between two adjacent squares", () => {
    expect(getSquaresOnTrajectory([3, 0], [3, 1])).toEqual([]);
    expect(getSquaresOnTrajectory([3, 0], [4, 1])).toEqual([]);
  });

  it("excludes both the origin and the destination", () => {
    const squares = getSquaresOnTrajectory([0, 0], [5, 5]);

    expect(squares).not.toContainEqual([0, 0]);
    expect(squares).not.toContainEqual([5, 5]);
    expect(squares).toHaveLength(4);
  });

  it("throws on a zero length move", () => {
    expect(() => getSquaresOnTrajectory([3, 3], [3, 3]))
      .toThrow(RangeError);
  });
});
