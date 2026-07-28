import { afterEach, describe, expect, it, vi } from "vitest";

import { generateLevelBlueprint } from "app/utils/level-generator";
import { parseBlueprint } from "app/utils/parse-blueprint";

const DIMENSIONS = { columns: 8, rows: 17 };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generateLevelBlueprint", () => {

  it("produit une chaîne d'un chiffre par case", () => {
    const blueprint = generateLevelBlueprint(DIMENSIONS);

    expect(blueprint).toHaveLength(8 * 17);
    expect(blueprint).toMatch(/^[0-7]+$/);
  });

  it("laisse toujours la colonne 3 praticable", () => {
    // C'est ce qui garantit qu'un niveau généré est franchissable : il existe
    // toujours au moins un couloir droit du départ à l'arrivée.
    for (let attempt = 0; attempt < 50; attempt++) {
      const rows = parseBlueprint(generateLevelBlueprint(DIMENSIONS), 8);

      for (const row of rows) {
        expect(row[3]).toBe(1);
      }
    }
  });

  it("laisse les quatre premières rangées entièrement pleines", () => {
    for (let attempt = 0; attempt < 50; attempt++) {
      const rows = parseBlueprint(generateLevelBlueprint(DIMENSIONS), 8);

      for (const row of rows.slice(0, 4)) {
        expect(row).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
      }
    }
  });

  it("résiste à un Math.random figé", () => {
    // Note de testabilité : level-generator.js fait `const { random } = Math`
    // au chargement du module, donc la référence est capturée une fois pour
    // toutes et ce stub n'a aucun effet sur la génération. On vérifie
    // seulement que la sortie reste bien formée ; rendre la source d'aléa
    // injectable serait le préalable à un vrai test déterministe.
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    expect(generateLevelBlueprint(DIMENSIONS)).toMatch(/^[0-7]{136}$/);
  });

  it("place trous et pièces hors des quatre premières rangées", () => {
    const values = new Set(
      generateLevelBlueprint({ columns: 8, rows: 400 }).split("")
    );

    expect(values.has("0")).toBe(true);
    expect([...values].some((value) => Number(value) > 1)).toBe(true);
  });
});
