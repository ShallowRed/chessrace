import {
  isLongRange,
  isValidMove,
  isValidTake
} from 'app/game-objects/pieces/movements';

import { readThreat, sameSquare, squareKey, withTaken } from 'app/level/threat';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

import { PIECE_NAMES } from 'app/types';

import type { Coords, PieceName, PiecePlacement } from 'app/types';

// Taking a piece removes what it held, so the way forward can depend on what
// has already been eaten. The state has to carry it.
export interface Standing extends PiecePlacement {
  taken?: string;
}

export type DeathCause = "hole" | "watched";

// What a click means, whoever is asking. The game plays it, the solver keeps
// the ones that go somewhere, and the metric counts the ones that do not.
export type Outcome =
  | { kind: "illegal" }
  | { kind: "move"; to: Coords }
  | { kind: "capture"; to: Coords; becomes: PieceName }
  | { kind: "death"; at: Coords; cause: DeathCause };

export interface Rules {
  rows: number;
  columns: number;
  isEnemy: (square: Coords) => boolean;
  isHeld: (taken: string | undefined, square: Coords) => boolean;
  isInBoard: (square: Coords) => boolean;
  resolve: (from: Standing, target: Coords) => Outcome;
  movesFrom: (from: Standing) => Standing[];
}

const ILLEGAL: Outcome = { kind: "illegal" };

export function readRules(blueprint: number[][], columns: number): Rules {

  const rows = blueprint.length;

  const valueAt = ([col, row]: Coords) => blueprint[row]?.[col];

  const isHole = (square: Coords) => valueAt(square) === 0;

  const standing = (square: Coords) => (valueAt(square) ?? 0) > 1;

  const enemyAt = (square: Coords) =>
    PIECE_NAMES[(valueAt(square) ?? 0) - 2] as PieceName;

  const isInBoard = ([col, row]: Coords) =>
    col >= 0 && row >= 0 && col < columns && row <= rows;

  const heldFor = readThreat(blueprint, columns);

  const eaten = (taken: string | undefined, square: Coords) =>
    (taken ?? "").split(" ").includes(squareKey(square));

  const isEnemyLeft = (taken: string | undefined, square: Coords) =>
    standing(square) && !eaten(taken, square);

  const isHeld = (taken: string | undefined, square: Coords) =>
    heldFor(taken).has(squareKey(square));

  function resolve(from: Standing, target: Coords): Outcome {

    if (sameSquare(from.position, target) || !isInBoard(target)) return ILLEGAL;

    const enemy = isEnemyLeft(from.taken, target);

    const legal = enemy
      ? isValidTake(from, target)
      : isValidMove(from, target);

    if (!legal) return ILLEGAL;

    // A long line dies at the first thing it cannot pass, which is not always
    // the square that was clicked.
    if (isLongRange(from.pieceName)) {

      for (const square of getSquaresOnTrajectory(from.position, target)) {

        if (isHole(square)) return { kind: "death", at: square, cause: "hole" };

        if (isEnemyLeft(from.taken, square) || isHeld(from.taken, square)) {

          return ILLEGAL;
        }
      }
    }

    if (isHole(target)) return { kind: "death", at: target, cause: "hole" };

    if (isHeld(from.taken, target)) return ILLEGAL;

    return enemy
      ? { kind: "capture", to: target, becomes: enemyAt(target) }
      : { kind: "move", to: target };
  }

  function movesFrom(from: Standing): Standing[] {

    const reached: Standing[] = [];

    const taken = from.taken ?? "";

    for (let row = 0; row <= rows; row++) {

      for (let col = 0; col < columns; col++) {

        const outcome = resolve(from, [col, row]);

        if (outcome.kind === "move") {

          reached.push({ position: outcome.to, pieceName: from.pieceName, taken });
        }

        if (outcome.kind === "capture") {

          reached.push({
            position: outcome.to,
            pieceName: outcome.becomes,
            taken: withTaken(taken, outcome.to)
          });
        }
      }
    }

    return reached;
  }

  return { rows, columns, isEnemy: standing, isHeld, isInBoard, resolve, movesFrom };
}
