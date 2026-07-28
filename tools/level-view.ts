import { blueprintOf, levelBySlug, levels } from 'app/level/catalogue';
import { solve } from 'app/level/solve';
import { readThreat, squareKey } from 'app/level/threat';

import type { Level } from 'app/level/catalogue';
import type { Coords } from 'app/types';

// Matches the PIECE_NAMES order a blueprint digit indexes into.
const SYMBOLS = "BKNPQR";

const HOLE = " ";
const SQUARE = "·";
const HELD = "×";
const STEP = "○";

function view(level: Level): string {

  const blueprint = blueprintOf(level);

  const held = readThreat(blueprint, level.columns)();

  const solution = solve(blueprint, level.columns, level.spawn);

  const walked = new Set(
    [level.spawn.position, ...solution?.moves ?? []].map(squareKey)
  );

  const cell = (square: Coords) => {

    const value = blueprint[square[1]]?.[square[0]] ?? 1;

    if (value === 0) return HOLE;

    if (value > 1) return SYMBOLS[value - 2] ?? "?";

    if (walked.has(squareKey(square))) return STEP;

    return held.has(squareKey(square)) ? HELD : SQUARE;
  };

  const lines: string[] = [];

  for (let row = blueprint.length; row >= 0; row--) {

    const cells = Array.from(
      { length: level.columns },
      (_empty, col) => cell([col, row])
    );

    lines.push(`  ${row === blueprint.length ? "⇒" : " "} ${cells.join(" ")}`);
  }

  const summary = solution
    ? `par ${solution.moves.length}, ${solution.captures} taken, ${solution.forms.join(" → ")}`
    : "UNSOLVABLE";

  return `\n  ${level.name} (${level.spawn.pieceName}) — ${summary}\n\n${lines.join("\n")}\n`;
}

const wanted = process.argv.slice(2);

const chosen = wanted.length ? wanted.map(levelBySlug) : levels;

for (const level of chosen) process.stdout.write(view(level));
