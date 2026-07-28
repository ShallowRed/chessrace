import { describe, expect, it } from "vitest";

import { levelBySlug, levels } from "app/level/catalogue";
import { par, rate } from "app/level/par";

describe("par", () => {

  it("is the length of the shortest solution", () => {
    expect(par(levelBySlug("climb"))).toBe(2);
    expect(par(levelBySlug("the-gauntlet"))).toBe(7);
  });

  it("is known for every level in the catalogue", () => {
    for (const level of levels) {
      expect(par(level)).toBeGreaterThan(1);
    }
  });

  it("is the same on a second call", () => {
    expect(par(levelBySlug("leap"))).toBe(par(levelBySlug("leap")));
  });
});

describe("rate", () => {

  it("gives three for a run no longer than the shortest", () => {
    expect(rate(4, 4)).toBe(3);
    expect(rate(3, 4)).toBe(3);
  });

  it("gives two for up to two moves over", () => {
    expect(rate(5, 4)).toBe(2);
    expect(rate(6, 4)).toBe(2);
  });

  it("gives one beyond that", () => {
    expect(rate(7, 4)).toBe(1);
    expect(rate(40, 4)).toBe(1);
  });
});
