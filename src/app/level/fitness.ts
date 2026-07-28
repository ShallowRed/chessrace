import { VISIBLE_ROWS } from 'app/config';
import { levelConfig } from 'app/level/config';
import { playthrough, planner } from 'app/level/personas';
import { countRoutes, solve } from 'app/level/solve';
import { tension, UNWINNABLE } from 'app/level/tension';

import type { Level } from 'app/level/catalogue';

export interface Score {
  total: number;
  par: number;
  routes: number;
  costly: number;
  worstRegret: number;
  unseen: number;
  reasons: string[];
}

// What a level is being asked for, and what it loses by missing it. A band is
// scored on how far outside it the level falls, so the search has a gradient
// to follow instead of a cliff.
export const WANTED = {
  par: [6, 14],
  routes: [2, 24],
  costly: [3, 8],
  worstRegret: [4, 20],
  unseen: [1, 8]
} as const;

const DEAD = -1000;

export function score(level: Level, blueprint: number[][]): Score {

  const { columns, spawn } = level;

  const nothing = (reason: string): Score => ({
    total: DEAD, par: 0, routes: 0, costly: 0, worstRegret: 0, unseen: 0,
    reasons: [reason]
  });

  const solution = solve(blueprint, columns, spawn);

  if (!solution) return nothing("unsolvable");

  const { durations } = levelConfig(level);

  const run = playthrough(blueprint, columns, spawn, durations,
    planner(blueprint, columns, spawn));

  if (run.outcome !== "won") return nothing(`the planner is ${run.outcome}`);

  const { choices, worstRegret } = tension(blueprint, columns, spawn);

  const measured = {
    par: solution.moves.length,
    routes: countRoutes(blueprint, columns, spawn),
    costly: choices,
    // A level where every mistake is fatal is not tense, it is a quiz.
    worstRegret: worstRegret === UNWINNABLE ? 0 : worstRegret,
    unseen: Math.max(0, blueprint.length - VISIBLE_ROWS)
  };

  const reasons: string[] = [];

  let total = 0;

  for (const [name, [low, high]] of Object.entries(WANTED)) {

    const value = measured[name as keyof typeof WANTED];

    const miss = value < low ? low - value : Math.max(0, value - high);

    total -= miss;

    if (miss) reasons.push(`${name} ${value}, wants ${low}-${high}`);
  }

  return { ...measured, total, reasons };
}
