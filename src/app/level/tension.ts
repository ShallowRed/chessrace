import { readBoard, solve } from 'app/level/solve';

import type { PiecePlacement } from 'app/types';

// A wrong move is rarely fatal here: the pieces move backwards, so almost
// anything can be walked back. What a wrong move costs is moves, and moves are
// what the scrolling board is charging for. Regret is that price.
export const UNWINNABLE = 99;

export interface Decision {
  row: number;
  options: number;
  // Moves that cost at least this much more than the best one. Below it, the
  // choice does not matter and the player is right not to think.
  tempting: number;
  worst: number;
}

export interface Tension {
  decisions: Decision[];
  choices: number;
  tempting: number;
  worstRegret: number;
}

export const REGRET_THAT_MATTERS = 2;

export function tension(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement
): Tension {

  const board = readBoard(blueprint, columns);

  const distances = new Map<string, number>();

  const distance = (state: PiecePlacement): number => {

    const id = board.key(state);

    const known = distances.get(id);

    if (known !== undefined) return known;

    const found = solve(blueprint, columns, state)?.moves.length ?? UNWINNABLE;

    distances.set(id, found);

    return found;
  };

  const route = solve(blueprint, columns, spawn);

  const decisions: Decision[] = [];

  let state: PiecePlacement = { ...spawn };

  for (const square of route?.moves ?? []) {

    const options = board.movesFrom(state);

    const base = distance(state);

    const regrets = options.map(option => {

      const onward = distance(option);

      return onward >= UNWINNABLE ? UNWINNABLE : 1 + onward - base;
    });

    decisions.push({
      row: state.position[1],
      options: options.length,
      tempting: regrets.filter(regret => regret >= REGRET_THAT_MATTERS).length,
      worst: Math.max(0, ...regrets)
    });

    state = options.find(({ position: [col, row] }) =>
      col === square[0] && row === square[1]) ?? state;
  }

  return {
    decisions,
    choices: decisions.filter(({ tempting }) => tempting > 0).length,
    tempting: decisions.reduce((total, step) => total + step.tempting, 0),
    worstRegret: Math.max(0, ...decisions.map(({ worst }) => worst))
  };
}
