import {
  isLongRange,
  isValidMove,
  isValidTake
} from 'app/game-objects/pieces/movements';

import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

import { PIECE_NAMES } from 'app/types';

import type { Coords, PieceName, PiecePlacement } from 'app/types';

export interface Solution {
  moves: Coords[];
  forms: PieceName[];
  captures: number;
}

// Counting every route of a wide open board is pointless and slow, so the
// count saturates: past this, the level is a stroll whatever the exact figure.
export const TOO_MANY_ROUTES = 999;

interface Board {
  rows: number;
  key: (state: PiecePlacement) => string;
  isEnemy: (square: Coords) => boolean;
  movesFrom: (state: PiecePlacement) => PiecePlacement[];
}

export function isBeatable(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement
): boolean {

  return solve(blueprint, columns, spawn) !== null;
}

export function solve(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement
): Solution | null {

  const board = readBoard(blueprint, columns);

  const start = spawned(spawn);

  const queue: PiecePlacement[] = [start];

  const cameFrom = new Map<string, PiecePlacement | null>([
    [board.key(start), null]
  ]);

  while (queue.length) {

    const state = queue.shift() as PiecePlacement;

    if (state.position[1] === board.rows) return pathTo(state);

    for (const next of board.movesFrom(state)) {

      if (cameFrom.has(board.key(next))) continue;

      cameFrom.set(board.key(next), state);

      queue.push(next);
    }
  }

  return null;

  function pathTo(end: PiecePlacement): Solution {

    const path: PiecePlacement[] = [];

    for (
      let step: PiecePlacement | null | undefined = end;
      step;
      step = cameFrom.get(board.key(step))
    ) {
      path.unshift(step);
    }

    const moves = path.slice(1).map(({ position }) => position);

    return {
      moves,
      forms: path
        .map(({ pieceName }) => pieceName)
        .filter((pieceName, index, all) => pieceName !== all[index - 1]),
      captures: moves.filter(board.isEnemy).length
    };
  }
}

// How forced the play is: the number of distinct shortest routes to the
// finishing line. One route is a tightrope, forty is a stroll.
export function countRoutes(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement
): number {

  const board = readBoard(blueprint, columns);

  const start = spawned(spawn);

  let frontier = new Map([[board.key(start), { state: start, routes: 1 }]]);

  const seen = new Set(frontier.keys());

  while (frontier.size) {

    const won = [...frontier.values()]
      .filter(({ state }) => state.position[1] === board.rows);

    if (won.length) {

      return capped(won.reduce((total, { routes }) => total + routes, 0));
    }

    const next = new Map<string, { state: PiecePlacement; routes: number }>();

    for (const { state, routes } of frontier.values()) {

      for (const reached of board.movesFrom(state)) {

        const id = board.key(reached);

        if (seen.has(id)) continue;

        next.set(id, {
          state: reached,
          routes: capped((next.get(id)?.routes ?? 0) + routes)
        });
      }
    }

    for (const id of next.keys()) seen.add(id);

    frontier = next;
  }

  return 0;
}

const capped = (routes: number) => Math.min(routes, TOO_MANY_ROUTES);

const spawned = ({ position, pieceName }: PiecePlacement): PiecePlacement =>
  ({ position, pieceName });

function readBoard(blueprint: number[][], columns: number): Board {

  const rows = blueprint.length;

  const valueAt = ([col, row]: Coords) => blueprint[row]?.[col];

  const isHole = (square: Coords) => valueAt(square) === 0;

  const isEnemy = (square: Coords) => (valueAt(square) ?? 0) > 1;

  const enemyAt = (square: Coords) =>
    PIECE_NAMES[(valueAt(square) ?? 0) - 2] as PieceName;

  const isInBoard = ([col, row]: Coords) =>
    col >= 0 && row >= 0 && col < columns && row <= rows;

  const isReachable = (state: PiecePlacement, target: Coords) => {

    const legal = isEnemy(target)
      ? isValidTake(state, target)
      : isValidMove(state, target);

    if (!legal || isHole(target)) return false;

    if (!isLongRange(state.pieceName)) return true;

    return !getSquaresOnTrajectory(state.position, target)
      .some(square => isHole(square) || isEnemy(square));
  };

  return {

    rows,

    isEnemy,

    key: ({ position: [col, row], pieceName }) => `${col}_${row}_${pieceName}`,

    movesFrom: (state) => {

      const reached: PiecePlacement[] = [];

      for (let row = 0; row <= rows; row++) {

        for (let col = 0; col < columns; col++) {

          const target: Coords = [col, row];

          if (!isInBoard(target) || !isReachable(state, target)) continue;

          reached.push({
            position: target,
            pieceName: isEnemy(target) ? enemyAt(target) : state.pieceName
          });
        }
      }

      return reached;
    }
  };
}
