import { blueprintOf, worlds } from 'app/level/catalogue';
import { levelConfig } from 'app/level/config';
import { score } from 'app/level/fitness';
import { par } from 'app/level/par';
import { playthroughs, slack } from 'app/level/personas';
import { countRoutes } from 'app/level/solve';
import { tension } from 'app/level/tension';

import type { Level } from 'app/level/catalogue';

const pad = (value: unknown, width: number) => String(value).padEnd(width);

const rpad = (value: unknown, width: number) => String(value).padStart(width);

function row(level: Level): string {

  const blueprint = blueprintOf(level);

  const { columns, spawn } = level;

  const { durations } = levelConfig(level);

  const runs = playthroughs(blueprint, columns, spawn, durations);

  const survivors = runs.filter(({ outcome }) => outcome === "won");

  const { choices, tempting, worstCost, worstRegret, decisions } =
    tension(blueprint, columns, spawn);

  const widest = Math.max(0, ...decisions.map(({ options }) => options));

  return [
    "  " + pad(level.name, 18),
    pad(spawn.pieceName, 7),
    rpad(par(level), 3),
    rpad(countRoutes(blueprint, columns, spawn), 7),
    rpad(`${choices}/${decisions.length}`, 8),
    rpad(widest, 6),
    rpad(tempting, 6),
    rpad(worstCost, 5),
    rpad(worstRegret, 5),
    rpad(slack(blueprint, columns, spawn, durations), 6),
    rpad(`${survivors.length}/${runs.length}`, 6),
    rpad(score(level, blueprint).total, 6)
  ].join(" ");
}

process.stdout.write(
  `\n  ${pad("level", 18)} ${pad("piece", 7)} par  routes` +
  `  costly  wide  tempt  cost  regr   s/mv  alive  score\n`
);

for (const world of worlds) {

  process.stdout.write(`\n  ${world.name.toUpperCase()} — ${world.blurb}\n`);

  for (const level of world.levels) process.stdout.write(`${row(level)}\n`);
}

// The metric only ever looks at legal moves, and stepping into a hole is not
// one. Every level in The long fall is tenser in the hand than it reads here.
process.stdout.write("\n");
