import {
  isLongRange,
  isValidMove,
  isValidTake
} from 'app/game-objects/pieces/models/pieces-movements';

import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

import { PIECE_NAMES } from 'app/types';

import type { Coords, PieceName, PiecePlacement } from 'app/types';

interface State {
  position: Coords;
  pieceName: PieceName;
}

export function isBeatable(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement
): boolean {

  const rows = blueprint.length;

  const valueAt = ([col, row]: Coords) => blueprint[row]?.[col];

  const isHole = (square: Coords) => valueAt(square) === 0;

  const isEnemy = (square: Coords) => (valueAt(square) ?? 0) > 1;

  const enemyAt = (square: Coords) =>
    PIECE_NAMES[(valueAt(square) ?? 0) - 2] as PieceName;

  const isInBoard = ([col, row]: Coords) =>
    col >= 0 && row >= 0 && col < columns && row <= rows;

  const key = ({ position: [col, row], pieceName }: State) =>
    `${col}_${row}_${pieceName}`;

  const start: State = { position: spawn.position, pieceName: spawn.pieceName };

  const queue: State[] = [start];

  const seen = new Set([key(start)]);

  while (queue.length) {

    const state = queue.shift() as State;

    if (state.position[1] === rows) return true;

    for (const next of movesFrom(state)) {

      if (seen.has(key(next))) continue;

      seen.add(key(next));

      queue.push(next);
    }
  }

  return false;

  function movesFrom(state: State): State[] {

    const reached: State[] = [];

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

  function isReachable(state: State, target: Coords): boolean {

    const legal = isEnemy(target)
      ? isValidTake(state, target)
      : isValidMove(state, target);

    if (!legal || isHole(target)) return false;

    if (!isLongRange(state.pieceName)) return true;

    return !getSquaresOnTrajectory(state.position, target)
      .some(square => isHole(square) || isEnemy(square));
  }
}
