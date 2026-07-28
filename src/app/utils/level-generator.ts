import { isBeatable } from 'app/level/solve';
import { parseBlueprint } from 'app/utils/parse-blueprint';

import type { PiecePlacement } from 'app/types';

const { floor, round, random } = Math;

export const RANDOM_SPAWN: PiecePlacement = {
  position: [3, 0],
  pieceName: "queen"
};

const ATTEMPTS = 40;

export function generateLevelBlueprint(
  { columns, rows }: { columns: number; rows: number }
): string {

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {

    const blueprint = draw(columns, rows, squareValue);

    if (isBeatable(parseBlueprint(blueprint, columns), columns, RANDOM_SPAWN)) {

      return blueprint;
    }
  }

  return draw(columns, rows, terrainOnly);
}

const draw = (
  columns: number,
  rows: number,
  value: (row: number, column: number) => number
): string =>

  Array.from({ length: rows }, (_row, row) =>
    Array.from({ length: columns }, (_column, column) => value(row, column))
  )
    .flat()
    .join('');

function squareValue(row: number, column: number): number {

  if (column === 3) return 1;

  if (row < 4 || round(random())) return 1;

  return round(random()) ? 0 : floor(random() * 8);
}

// The fallback when the dice keep locking the board: holes cannot hold a square.
function terrainOnly(row: number, column: number): number {

  const value = squareValue(row, column);

  return value > 1 ? 0 : value;
}
