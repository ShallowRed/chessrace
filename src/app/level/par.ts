import { NEAR_ENOUGH } from 'app/config';
import { blueprintOf } from 'app/level/catalogue';
import { solve } from 'app/level/solve';

import type { Level } from 'app/level/catalogue';

export type Rating = 1 | 2 | 3;

const pars = new Map<string, number>();

export function par(level: Level): number {

  const known = pars.get(level.slug);

  if (known !== undefined) return known;

  const solution = solve(blueprintOf(level), level.columns, level.spawn);

  const moves = solution?.moves.length ?? 0;

  pars.set(level.slug, moves);

  return moves;
}

export function rate(moves: number, shortest: number): Rating {

  if (moves <= shortest) return 3;

  if (moves <= shortest + NEAR_ENOUGH) return 2;

  return 1;
}
