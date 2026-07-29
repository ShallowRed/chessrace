import { isLongRange, isValidTake } from 'app/game-objects/pieces/movements';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

import { PIECE_NAMES } from 'app/types';

import type { Coords, PieceName, PiecePlacement } from 'app/types';

export type Blocked = (square: Coords) => boolean;

export type Held = (taken?: string) => ReadonlySet<string>;

export const sameSquare = ([c1, r1]: Coords, [c2, r2]: Coords) =>
  c1 === c2 && r1 === r2;

export const squareKey = ([col, row]: Coords) => `${col}_${row}`;

const unkey = (key: string): Coords => {

  const [col, row] = key.split("_").map(Number);

  return [col as number, row as number];
};

export const withTaken = (taken: string, square: Coords) =>
  [...taken.split(" "), squareKey(square)].filter(Boolean).sort().join(" ");

// An enemy holds every square it could take on, by its own rules. Its line is
// cut by holes and by the other pieces, but not by the player: where the
// player stands cannot decide where the player may stand.
export function attacks(
  enemy: PiecePlacement,
  target: Coords,
  blocked: Blocked
): boolean {

  if (sameSquare(enemy.position, target)) return false;

  if (!isValidTake(enemy, target, "enemy")) return false;

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

        if (attacks(enemy, target, blocked)) held.add(squareKey(target));
      }
    }
  }

  return held;
}

export function readThreat(blueprint: number[][], columns: number): Held {

  const rows = blueprint.length;

  const valueAt = ([col, row]: Coords) => blueprint[row]?.[col] ?? 0;

  const enemies: PiecePlacement[] = [];

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < columns; col++) {

      const value = valueAt([col, row]);

      if (value > 1) {

        enemies.push({
          position: [col, row],
          pieceName: PIECE_NAMES[value - 2] as PieceName
        });
      }
    }
  }

  const known = new Map<string, ReadonlySet<string>>();

  return (taken = "") => {

    const cached = known.get(taken);

    if (cached) return cached;

    const gone = new Set(taken.split(" ").filter(Boolean));

    const left = enemies.filter(({ position }) => !gone.has(squareKey(position)));

    const blocked = (square: Coords) =>
      valueAt(square) === 0 ||
      (valueAt(square) > 1 && !gone.has(squareKey(square)));

    const held = heldSquares(left, blocked, columns, rows);

    // A hole is already fatal, and marking it held would only hide that.
    for (const key of held) if (valueAt(unkey(key)) === 0) held.delete(key);

    known.set(taken, held);

    return held;
  };
}
