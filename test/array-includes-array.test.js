import { describe, expect, it } from "vitest";

import { arrayIncludesArray } from "app/utils/array-includes-array";

describe("arrayIncludesArray", () => {

  const includes = arrayIncludesArray([[0, 0], [1, 2], [3, 4]]);

  it("reconnaît une coordonnée présente, quelle que soit l'identité du tableau", () => {
    expect(includes([1, 2])).toBe(true);
    expect(includes([3, 4])).toBe(true);
  });

  it("rejette une coordonnée absente", () => {
    expect(includes([2, 1])).toBe(false);
    expect(includes([9, 9])).toBe(false);
  });

  it("distingue [1, 2] de [2, 1]", () => {
    expect(includes([1, 2])).toBe(true);
    expect(includes([2, 1])).toBe(false);
  });

  it("gère une liste vide", () => {
    expect(arrayIncludesArray([])([0, 0])).toBe(false);
  });

  // La comparaison passe par `join('_')`, donc une valeur contenant déjà un
  // souligné se confond avec une paire. Sans conséquence ici (les coordonnées
  // sont toujours des nombres), mais c'est l'argument pour passer un jour à un
  // Set de clés : ce serait à la fois plus sûr et en O(1) au lieu de O(n).
  it("confond deux clés qui s'aplatissent en la même chaîne", () => {
    expect(arrayIncludesArray([[1, 2, 3]])(["1_2", 3])).toBe(true);
  });
});
