import { blueprintOf } from "app/level/catalogue";
import { parseLevelGrid } from "app/level/notation";
import { countRoutes, solve } from "app/level/solve";
import { parseBlueprint } from "app/utils/parse-blueprint";

import type { Level } from "app/level/catalogue";
import type { Solution } from "app/level/solve";
import type { PieceName, PiecePlacement } from "app/types";

export const widthOf = (grid: string) =>
  (grid.trim().split("\n")[0] ?? "").trim().length;

export function solveGrid(
  grid: string,
  pieceName: PieceName,
  column = 0
): Solution | null {

  const columns = widthOf(grid);

  return solve(parseBlueprint(parseLevelGrid(grid), columns), columns, {
    position: [column, 0],
    pieceName
  });
}

export function solveGridFromAnywhere(
  grid: string,
  pieceName: PieceName
): Solution[] {

  return Array
    .from({ length: widthOf(grid) }, (_none, column) =>
      solveGrid(grid, pieceName, column))
    .filter((solution): solution is Solution => solution !== null);
}

export function routesThroughGrid(
  grid: string,
  pieceName: PieceName,
  column = 0
): number {

  const columns = widthOf(grid);

  return countRoutes(parseBlueprint(parseLevelGrid(grid), columns), columns, {
    position: [column, 0],
    pieceName
  });
}

export function routesThroughLevel(level: Level): number {

  return countRoutes(blueprintOf(level), level.columns, level.spawn);
}

export function solveLevel(
  level: Level,
  from: PiecePlacement = level.spawn
): Solution | null {

  return solve(blueprintOf(level), level.columns, from);
}
