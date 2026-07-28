import { describe, expect, it } from "vitest";

import { getSquaresOnTrajectory } from "app/utils/get-squares-on-trajectory";

describe("getSquaresOnTrajectory", () => {

  it("liste les cases traversées par une tour", () => {
    expect(getSquaresOnTrajectory([3, 0], [3, 4]))
      .toEqual([[3, 1], [3, 2], [3, 3]]);

    expect(getSquaresOnTrajectory([0, 2], [4, 2]))
      .toEqual([[1, 2], [2, 2], [3, 2]]);
  });

  it("liste les cases traversées par un fou", () => {
    expect(getSquaresOnTrajectory([0, 0], [3, 3]))
      .toEqual([[1, 1], [2, 2]]);
  });

  it("fonctionne dans les quatre directions", () => {
    expect(getSquaresOnTrajectory([4, 4], [1, 1]))
      .toEqual([[3, 3], [2, 2]]);

    expect(getSquaresOnTrajectory([4, 4], [1, 7]))
      .toEqual([[3, 5], [2, 6]]);
  });

  it("ne renvoie rien entre deux cases adjacentes", () => {
    expect(getSquaresOnTrajectory([3, 0], [3, 1])).toEqual([]);
    expect(getSquaresOnTrajectory([3, 0], [4, 1])).toEqual([]);
  });

  it("exclut toujours la case de départ et la case d'arrivée", () => {
    const squares = getSquaresOnTrajectory([0, 0], [5, 5]);

    expect(squares).not.toContainEqual([0, 0]);
    expect(squares).not.toContainEqual([5, 5]);
    expect(squares).toHaveLength(4);
  });

  // Piège connu : `new Array(deltaLength - 1)` avec deltaLength à 0 lève une
  // RangeError. Le cas n'est pas atteignable en jeu (le sprite du joueur
  // intercepte le clic sur sa propre case), mais la fonction est publique et
  // n'importe quel appelant futur tomberait dedans.
  it("lève sur un déplacement de longueur nulle (comportement actuel)", () => {
    expect(() => getSquaresOnTrajectory([3, 3], [3, 3]))
      .toThrow(RangeError);
  });
});
