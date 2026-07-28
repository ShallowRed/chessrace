import { describe, expect, it } from "vitest";

import { parseBlueprint } from "app/utils/parse-blueprint";

describe("parseBlueprint", () => {

  it("découpe la chaîne du niveau en rangées de `columns` nombres", () => {
    expect(parseBlueprint("111110111141", 4)).toEqual([
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 4, 1]
    ]);
  });

  it("conserve l'ordre des rangées et des colonnes", () => {
    const blueprint = parseBlueprint("012345", 3);

    expect(blueprint[0]).toEqual([0, 1, 2]);
    expect(blueprint[1]).toEqual([3, 4, 5]);
  });

  it("produit des nombres, pas des chaînes", () => {
    for (const value of parseBlueprint("1010", 2).flat()) {
      expect(typeof value).toBe("number");
    }
  });

  it("tolère une dernière rangée incomplète", () => {
    expect(parseBlueprint("11111", 4)).toEqual([
      [1, 1, 1, 1],
      [1]
    ]);
  });
});
