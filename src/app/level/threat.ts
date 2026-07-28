import { isLongRange, isValidTake } from 'app/game-objects/pieces/movements';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

import type { Coords, PiecePlacement } from 'app/types';

export type Blocked = (square: Coords) => boolean;

export const sameSquare = ([c1, r1]: Coords, [c2, r2]: Coords) =>
  c1 === c2 && r1 === r2;

// An enemy holds every square it could take on, by its own rules. Its line is
// cut by holes and by the other pieces, but not by the player: where the
// player stands cannot decide where the player may stand.
export function attacks(
  enemy: PiecePlacement,
  target: Coords,
  blocked: Blocked
): boolean {

  if (sameSquare(enemy.position, target)) return false;

  if (!isValidTake(enemy, target)) return false;

  if (!isLongRange(enemy.pieceName)) return true;

  return !getSquaresOnTrajectory(enemy.position, target).some(blocked);
}

export function heldSquares(
  enemies: PiecePlacement[],
  blocked: Blocked,
  columns: number,
  rows: number
): Set<string> {

  const held = new Set<string>();

  for (const enemy of enemies) {

    for (let row = 0; row <= rows; row++) {

      for (let col = 0; col < columns; col++) {

        const target: Coords = [col, row];

        if (attacks(enemy, target, blocked)) held.add(`${col}_${row}`);
      }
    }
  }

  return held;
}
