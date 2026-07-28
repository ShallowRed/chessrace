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
export interface State extends PiecePlacement {
  taken?: string;
}

export interface Solution {
  moves: Coords[];
  forms: PieceName[];
  captures: number;
}

export const TOO_MANY_ROUTES = 999;

const STATE_LIMIT = 200000;

export interface Board {
  rows: number;
  key: (state: State) => string;
  isEnemy: (square: Coords) => boolean;
  isHeld: (state: State, square: Coords) => boolean;
  movesFrom: (state: State) => State[];
}

export function isBeatable(
  blueprint: number[][],
  columns: number,
  spawn: State
): boolean {

  return solve(blueprint, columns, spawn) !== null;
}

export function solve(
  blueprint: number[][],
  columns: number,
  spawn: State
): Solution | null {

  const board = readBoard(blueprint, columns);

  const start = spawned(spawn);

  if (board.isHeld(start, start.position)) return null;

  const queue: State[] = [start];

  const cameFrom = new Map<string, State | null>([[board.key(start), null]]);

  while (queue.length) {

    const state = queue.shift() as State;

    if (state.position[1] === board.rows) return pathTo(state);

    for (const next of board.movesFrom(state)) {

      if (cameFrom.has(board.key(next))) continue;

      cameFrom.set(board.key(next), state);

      queue.push(next);
    }

    if (cameFrom.size > STATE_LIMIT) return null;
  }

  return null;

  function pathTo(end: State): Solution {

    const path: State[] = [];

    for (
      let step: State | null | undefined = end;
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

export function countRoutes(
  blueprint: number[][],
  columns: number,
  spawn: State
): number {

  const board = readBoard(blueprint, columns);

  const start = spawned(spawn);

  if (board.isHeld(start, start.position)) return 0;

  let frontier = new Map([[board.key(start), { state: start, routes: 1 }]]);

  const seen = new Set(frontier.keys());

  while (frontier.size) {

    const won = [...frontier.values()]
      .filter(({ state }) => state.position[1] === board.rows);

    if (won.length) {

      return capped(won.reduce((total, { routes }) => total + routes, 0));
    }

    const next = new Map<string, { state: State; routes: number }>();

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

    if (seen.size > STATE_LIMIT) return capped(TOO_MANY_ROUTES);

    frontier = next;
  }

  return 0;
}

const capped = (routes: number) => Math.min(routes, TOO_MANY_ROUTES);

const spawned = ({ position, pieceName, taken = "" }: State): State =>
  ({ position, pieceName, taken });

export function readBoard(blueprint: number[][], columns: number): Board {

  const rows = blueprint.length;

  const valueAt = ([col, row]: Coords) => blueprint[row]?.[col];

  const isHole = (square: Coords) => valueAt(square) === 0;

  const standing = (square: Coords) => (valueAt(square) ?? 0) > 1;

  const enemyAt = (square: Coords) =>
    PIECE_NAMES[(valueAt(square) ?? 0) - 2] as PieceName;

  const isInBoard = ([col, row]: Coords) =>
    col >= 0 && row >= 0 && col < columns && row <= rows;

  const heldFor = readThreat(blueprint, columns);

  const isEnemyLeft = (state: State, square: Coords) =>
    standing(square) &&
    !(state.taken ?? "").split(" ").includes(squareKey(square));

  const isReachable = (state: State, target: Coords) => {

    const enemy = isEnemyLeft(state, target);

    const legal = enemy
      ? isValidTake(state, target)
      : isValidMove(state, target);

    if (!legal || isHole(target)) return false;

    const held = heldFor(state.taken);

    if (held.has(squareKey(target))) return false;

    if (!isLongRange(state.pieceName)) return true;

    return !getSquaresOnTrajectory(state.position, target).some(square =>
      isHole(square) || isEnemyLeft(state, square) || held.has(squareKey(square)));
  };

  return {

    rows,

    isEnemy: standing,

    isHeld: (state, square) => heldFor(state.taken).has(squareKey(square)),

    key: ({ position: [col, row], pieceName, taken = "" }) =>
      `${col}_${row}_${pieceName}_${taken}`,

    movesFrom: (state) => {

      const reached: State[] = [];

      const taken = state.taken ?? "";

      for (let row = 0; row <= rows; row++) {

        for (let col = 0; col < columns; col++) {

          const target: Coords = [col, row];

          if (sameSquare(target, state.position)) continue;

          if (!isInBoard(target) || !isReachable(state, target)) continue;

          const enemy = isEnemyLeft(state, target);

          reached.push({
            position: target,
            pieceName: enemy ? enemyAt(target) : state.pieceName,
            taken: enemy ? withTaken(taken, target) : taken
          });
        }
      }

      return reached;
    }
  };
}
