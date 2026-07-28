import { isLongRange } from 'app/game-objects/pieces/movements';
import { attacks } from 'app/level/threat';
import { parseBlueprint } from 'app/utils/parse-blueprint';

import { PIECE_NAMES } from 'app/types';

import type { Coords, PieceName, PiecePlacement } from 'app/types';

const { floor, round, random } = Math;

const LANE = 3;

export const RANDOM_SPAWN: PiecePlacement = {
  position: [LANE, 0],
  pieceName: "queen"
};

// Only the pieces that cannot wall off a rank: a rook or a queen dropped at
// random cuts the board in two more often than not.
const SHORT_RANGE = PIECE_NAMES
  .map((pieceName, index) => ({ pieceName, value: index + 2 }))
  .filter(({ pieceName }) => !isLongRange(pieceName))
  .map(({ value }) => value);

export function generateLevelBlueprint(
  { columns, rows }: { columns: number; rows: number }
): string {

  const blueprint = parseBlueprint(draw(columns, rows), columns);

  clearTheLane(blueprint, columns, rows);

  return blueprint.flat().join("");
}

const draw = (columns: number, rows: number): string =>

  Array.from({ length: rows }, (_row, row) =>
    Array.from({ length: columns }, (_column, column) => squareValue(row, column))
  )
    .flat()
    .join('');

function squareValue(row: number, column: number): number {

  if (column === LANE) return 1;

  if (row < 4 || round(random())) return 1;

  if (round(random())) return 0;

  return SHORT_RANGE[floor(random() * SHORT_RANGE.length)] as number;
}

// The lane is what makes a drawn level beatable: the spawning queen climbs it
// in one move. Any enemy covering it has to go, and removing one widens what
// the others reach, so this runs until nothing is left covering the lane.
function clearTheLane(blueprint: number[][], columns: number, rows: number): void {

  const lane = Array.from({ length: rows + 1 }, (_none, row): Coords => [LANE, row]);

  for (;;) {

    const blocked = (square: Coords) => (valueAt(blueprint, square) ?? 0) !== 1;

    const offenders = enemiesOf(blueprint, columns, rows)
      .filter(enemy => lane.some(square => attacks(enemy, square, blocked)));

    if (!offenders.length) return;

    for (const { position: [col, row] } of offenders) {

      (blueprint[row] as number[])[col] = 1;
    }
  }
}

const valueAt = (blueprint: number[][], [col, row]: Coords) => blueprint[row]?.[col];

function enemiesOf(
  blueprint: number[][],
  columns: number,
  rows: number
): PiecePlacement[] {

  const enemies: PiecePlacement[] = [];

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < columns; col++) {

      const value = valueAt(blueprint, [col, row]) ?? 0;

      if (value > 1) {

        enemies.push({
          position: [col, row],
          pieceName: PIECE_NAMES[value - 2] as PieceName
        });
      }
    }
  }

  return enemies;
}
