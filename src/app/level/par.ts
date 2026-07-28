import { solve } from 'app/level/solve';
import { parseBlueprint } from 'app/utils/parse-blueprint';

import type { Level } from 'app/level/levels';

export type Rating = 1 | 2 | 3;

const pars = new Map<string, number>();

export function par(level: Level): number {

  const known = pars.get(level.slug);

  if (known !== undefined) return known;

  const solution = solve(
    parseBlueprint(level.blueprint, level.columns),
    level.columns,
    level.spawn
  );

  const moves = solution?.moves.length ?? 0;

  pars.set(level.slug, moves);

  return moves;
}

export function rate(moves: number, shortest: number): Rating {

  if (moves <= shortest) return 3;

  if (moves <= shortest + 2) return 2;

  return 1;
}
