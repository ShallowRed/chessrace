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

  const rows = blueprint.length;

  const valueAt = ([col, row]: Coords) => blueprint[row]?.[col];

  const isHole = (square: Coords) => valueAt(square) === 0;

  const isEnemy = (square: Coords) => (valueAt(square) ?? 0) > 1;

  const enemyAt = (square: Coords) =>
    PIECE_NAMES[(valueAt(square) ?? 0) - 2] as PieceName;

  const isInBoard = ([col, row]: Coords) =>
    col >= 0 && row >= 0 && col < columns && row <= rows;

  const key = ({ position: [col, row], pieceName }: PiecePlacement) =>
    `${col}_${row}_${pieceName}`;

  const start: PiecePlacement = {
    position: spawn.position,
    pieceName: spawn.pieceName
  };

  const queue: PiecePlacement[] = [start];

  const cameFrom = new Map<string, PiecePlacement | null>([[key(start), null]]);

  while (queue.length) {

    const state = queue.shift() as PiecePlacement;

    if (state.position[1] === rows) return pathTo(state);

    for (const next of movesFrom(state)) {

      if (cameFrom.has(key(next))) continue;

      cameFrom.set(key(next), state);

      queue.push(next);
    }
  }

  return null;

  function pathTo(end: PiecePlacement): Solution {

    const path: PiecePlacement[] = [];

    for (
      let step: PiecePlacement | null | undefined = end;
      step;
      step = cameFrom.get(key(step))
    ) {
      path.unshift(step);
    }

    const moves = path.slice(1).map(({ position }) => position);

    return {
      moves,
      forms: path
        .map(({ pieceName }) => pieceName)
        .filter((pieceName, index, all) => pieceName !== all[index - 1]),
      captures: moves.filter(isEnemy).length
    };
  }

  function movesFrom(state: PiecePlacement): PiecePlacement[] {

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

  function isReachable(state: PiecePlacement, target: Coords): boolean {

    const legal = isEnemy(target)
      ? isValidTake(state, target)
      : isValidMove(state, target);

    if (!legal || isHole(target)) return false;

    if (!isLongRange(state.pieceName)) return true;

    return !getSquaresOnTrajectory(state.position, target)
      .some(square => isHole(square) || isEnemy(square));
  }
}
