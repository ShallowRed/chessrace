import { parseLevelGrid } from 'app/level/level-notation';
import { pattern, shift, stack } from 'app/level/patterns';
import { generateLevelBlueprint } from 'app/utils/level-generator';

import type { Coords, PieceName } from 'app/types';

export interface Level {
  name: string;
  slug: string;
  hint?: string | undefined;
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
  hint?: string
): Level => {

  const rows = grid.split("\n").map(row => row.trim()).filter(Boolean);

  return {
    name,
    slug: slugOf(name),
    hint,
    columns: (rows[0] as string).length,
    rows: rows.length,
    spawn,
    blueprint: parseLevelGrid(grid)
  };
};

const OPEN_ROW = "........";

export const levels: Level[] = [

  level("Climb", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    "..___...",
    pattern("openGround"),
    pattern("openGround"),
    OPEN_ROW
  ), "Click a square your piece can reach. The board starts scrolling on your first move."),

  level("Mind the gap", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    shift(pattern("laneChasm"), 2),
    pattern("openGround"),
    pattern("laneChasm"),
    pattern("openGround")
  ), "A hole is fatal, and a long range piece dies crossing one."),

  level("Take to become", { position: [2, 0], pieceName: "pawn" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    pattern("ladder"),
    OPEN_ROW
  ), "Take a piece and you become it. A pawn only takes on the diagonal."),

  level("Leap", { position: [3, 0], pieceName: "knight" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    pattern("steppingStones"),
    OPEN_ROW
  ), "The knight is the only piece that jumps over holes."),

  level("Blocked line", { position: [3, 0], pieceName: "rook" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("openGround"),
    pattern("gate"),
    OPEN_ROW
  ), "A piece in the way stops a rook. Take it to get through."),

  level("Bad trade", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    pattern("openGround"),
    pattern("checkerVoid"),
    pattern("bait"),
    OPEN_ROW
  ), "Nothing forces you to take. A weaker piece is a worse form."),

  level("Switchback", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    pattern("comb"),
    pattern("openGround"),
    shift(pattern("comb"), 1),
    pattern("openGround"),
    pattern("comb"),
    OPEN_ROW
  )),

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
  `),

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
  `),

  level("The gauntlet", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    shift(pattern("checkerVoid"), 1),
    ".....B..",
    pattern("steppingStones"),
    "...N....",
    pattern("gate"),
    OPEN_ROW
  ))

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
