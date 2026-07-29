import { readRules } from 'app/level/rules';

import type { Rules, Standing } from 'app/level/rules';
import type { Coords, PieceName } from 'app/types';

export type State = Standing;

export interface Solution {
  moves: Coords[];
  forms: PieceName[];
  captures: number;
}

export const TOO_MANY_ROUTES = 999;

const STATE_LIMIT = 200000;

export interface Board extends Rules {
  key: (state: State) => string;
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

  if (board.isHeld(start.taken, start.position)) return null;

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

  if (board.isHeld(start.taken, start.position)) return 0;

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

  const rules = readRules(blueprint, columns);

  return {
    ...rules,

    key: ({ position: [col, row], pieceName, taken = "" }) =>
      `${col}_${row}_${pieceName}_${taken}`
  };
}
