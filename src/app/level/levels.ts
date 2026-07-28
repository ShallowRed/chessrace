import { parseLevelGrid } from 'app/level/level-notation';
import { pattern, shift, stack } from 'app/level/patterns';
import { generateLevelBlueprint } from 'app/utils/level-generator';

import type { Coords, PieceName } from 'app/types';

export interface LevelOptions {
  hint?: string;
  speedUp?: number;
}

export interface Level {
  name: string;
  slug: string;
  hint?: string | undefined;
  speedUp?: number | undefined;
  columns: number;
  rows: number;
  spawn: { position: Coords; pieceName: PieceName };
  blueprint: string;
}

export function slugOf(name: string): string {

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const level = (
  name: string,
  spawn: { position: Coords; pieceName: PieceName },
  grid: string,
  { hint, speedUp }: LevelOptions = {}
): Level => {

  const rows = grid.split("\n").map(row => row.trim()).filter(Boolean);

  return {
    name,
    slug: slugOf(name),
    hint,
    speedUp,
    columns: (rows[0] as string).length,
    rows: rows.length,
    spawn,
    blueprint: parseLevelGrid(grid)
  };
};

const OPEN_ROW = "........";

const TEMPO = 0.93;

export const levels: Level[] = [

  level("Climb", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    "..___...",
    pattern("openGround"),
    pattern("openGround"),
    OPEN_ROW
  ), { hint: "Click a square your piece can reach. The board starts scrolling on your first move." }),

  level("Mind the gap", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    shift(pattern("laneChasm"), 2),
    pattern("openGround"),
    pattern("laneChasm"),
    pattern("openGround")
  ), { hint: "A hole is fatal, and a long range piece dies crossing one." }),

  level("Take to become", { position: [2, 0], pieceName: "pawn" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    pattern("ladder"),
    OPEN_ROW
  ), { hint: "Take a piece and you become it. A pawn only takes on the diagonal." }),

  level("Leap", { position: [3, 0], pieceName: "knight" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    pattern("steppingStones"),
    OPEN_ROW
  ), { hint: "The knight is the only piece that jumps over holes." }),

  level("Blocked line", { position: [3, 0], pieceName: "rook" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    pattern("gate"),
    OPEN_ROW
  ), { hint: "A piece in the way stops a rook. Take it to get through." }),

  level("Bad trade", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("checkerVoid"),
    pattern("bait"),
    OPEN_ROW
  ), { hint: "Nothing forces you to take. A weaker piece is a worse form." }),

  level("Switchback", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    pattern("comb"),
    pattern("openGround"),
    shift(pattern("comb"), 1),
    pattern("openGround"),
    pattern("comb"),
    OPEN_ROW
  ), { speedUp: TEMPO }),
  level("Knight school", { position: [3, 0], pieceName: "knight" }, `
    __.__.__
    _______.
    __.__.__
    .______.
    __.__.__
    _______.
    __.__.__
    ._____._
    __.__.__
    _______.
    __.__.__
    ._____._
    __.__.__
    _______.
    __...___
    ...N....
    ........
  `, { speedUp: TEMPO }),
  level("Pawn's promise", { position: [3, 0], pieceName: "pawn" }, `
    ...__...
    ..____..
    ._..__..
    ..____..
    ..____.Q
    __..__..
    .__.__..
    ..____..
    ._____..
    ..____..
    __.__._R
    .__.__..
    __.__...
    ..__B...
    ..N_....
    ........
    ........
  `, { speedUp: TEMPO }),
  level("The gauntlet", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    shift(pattern("checkerVoid"), 1),
    ".....B..",
    pattern("steppingStones"),
    "...N....",
    pattern("gate"),
    OPEN_ROW
  ), { speedUp: TEMPO })
];

export const defaultLevel = levels[0] as Level;

export function levelBySlug(slug: string | null): Level {

  return levels.find(level => level.slug === slug) ?? defaultLevel;
}

export function randomLevel(
  { columns, rows }: { columns: number; rows: number }
): Level {

  return {
    name: "Random",
    slug: "random",
    columns,
    rows,
    spawn: { position: [3, 0], pieceName: "queen" },
    blueprint: generateLevelBlueprint({ columns, rows })
  };
}
