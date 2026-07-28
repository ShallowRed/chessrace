import { readFileSync } from 'node:fs';

import { blueprintOf, levelBySlug, slugOf } from 'app/level/catalogue';
import { score } from 'app/level/fitness';
import { HOLE, parseLevelGrid, PIECE_SYMBOLS, SQUARE } from 'app/level/notation';

import { PIECE_NAMES } from 'app/types';

import type { Level } from 'app/level/catalogue';
import type { Score } from 'app/level/fitness';
import type { Coords, PieceName } from 'app/types';

// Propose, measure, keep what scores better. The point is not that the machine
// designs the level: it is that a level cannot be argued into being good, only
// measured, and a hand cannot try three thousand placements.
const ROUNDS = Number(process.env["ROUNDS"] ?? 600);

const SYMBOL_OF = Object.fromEntries(
  Object.entries(PIECE_SYMBOLS).map(([symbol, pieceName]) => [pieceName, symbol])
);

const seeded = (seed: number) => () =>
  ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

const random = seeded(Number(process.env["SEED"] ?? 7));

const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(random() * items.length)] as T;

const copy = (blueprint: number[][]) => blueprint.map(row => [...row]);

function mutate(level: Level, blueprint: number[][]): number[][] {

  const next = copy(blueprint);

  const [spawnCol, spawnRow] = level.spawn.position;

  const row = Math.floor(random() * next.length);

  const col = Math.floor(random() * level.columns);

  if (row === spawnRow && col === spawnCol) return next;

  (next[row] as number[])[col] = pick([0, 1, 1, ...PIECE_NAMES.map((_n, i) => i + 2)]);

  return next;
}

function draw(blueprint: number[][]): string {

  return blueprint
    .map(row => row
      .map(value => value === 0 ? HOLE
        : value === 1 ? SQUARE
          : SYMBOL_OF[PIECE_NAMES[value - 2] as string] ?? "?")
      .join(""))
    .reverse()
    .map(row => `    ${row}`)
    .join("\n");
}

const report = (label: string, of: Score) =>
  `${label} score ${of.total}, par ${of.par}, routes ${of.routes}, ` +
  `costly ${of.costly}, cost ${of.worstCost}, unseen ${of.unseen}` +
  (of.reasons.length ? ` — ${of.reasons.join("; ")}` : "");

// A skeleton is a grid file plus a spawn: the shape is the designer's call,
// the contents are what gets searched.
function skeleton(path: string): Level {

  const grid = readFileSync(path, "utf8");

  const rows = grid.split("\n").map(row => row.trim()).filter(Boolean);

  const name = path.split("/").pop() ?? "skeleton";

  return {
    name,
    slug: slugOf(name),
    world: "",
    columns: (rows[0] as string).length,
    rows: rows.length,
    spawn: {
      position: [Number(process.env["COL"] ?? 3), 0] as Coords,
      pieceName: (process.env["PIECE"] ?? "queen") as PieceName
    },
    blueprint: parseLevelGrid(rows.join("\n"))
  };
}

const subjects: Level[] = process.argv.slice(2)
  .map(argument => argument.includes("/") || argument.endsWith(".txt")
    ? skeleton(argument)
    : levelBySlug(argument));

for (const level of subjects) {

  let best = blueprintOf(level);

  let bestScore = score(level, best);

  process.stdout.write(`\n  ${level.name}\n  ${report("from:", bestScore)}\n`);

  for (let round = 0; round < ROUNDS; round++) {

    const candidate = mutate(level, best);

    const candidateScore = score(level, candidate);

    if (candidateScore.total > bestScore.total) {

      best = candidate;

      bestScore = candidateScore;
    }
  }

  process.stdout.write(`  ${report("to:  ", bestScore)}\n\n${draw(best)}\n`);
}
