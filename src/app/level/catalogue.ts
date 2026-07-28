import { FAST_TEMPO, TEMPO } from 'app/config';
import { parseLevelGrid } from 'app/level/notation';
import { parseBlueprint } from 'app/utils/parse-blueprint';
import { pattern, shift, stack } from 'app/level/patterns';
import { generateLevelBlueprint } from 'app/utils/level-generator';

import type { Coords, PieceName } from 'app/types';

export interface LevelOptions {
  hint?: string;
  speedUp?: number;
}

export interface World {
  name: string;
  slug: string;
  blurb: string;
  levels: Level[];
}

export interface Level {
  name: string;
  slug: string;
  world: string;
  hint?: string | undefined;
  speedUp?: number | undefined;
  columns: number;
  rows: number;
  spawn: { position: Coords; pieceName: PieceName };
  blueprint: string;
}

export function blueprintOf(level: Level): number[][] {

  return parseBlueprint(level.blueprint, level.columns);
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
    world: "",
    hint,
    speedUp,
    columns: (rows[0] as string).length,
    rows: rows.length,
    spawn,
    blueprint: parseLevelGrid(grid)
  };
};

const world = (name: string, blurb: string, levels: Level[]): World => {

  const slug = slugOf(name);

  return { name, slug, blurb, levels: levels.map(l => ({ ...l, world: slug })) };
};

const OPEN_ROW = "........";

const firstMoves: Level[] = [

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

];

const tradeRoutes: Level[] = [

  level("Small change", { position: [3, 0], pieceName: "pawn" }, `
    ___.____
    ___P____
    ____P___
    ___P____
    ____P___
    ___P____
    ____P___
    ___P____
    ____P___
    ___.____
  `),

  level("Toll", { position: [3, 0], pieceName: "queen" }, `
    _____.__
    ________
    ____.___
    ________
    _____.__
    ________
    ____N___
    ___P____
    ____P___
    ___P____
    ___.____
  `),

  level("The wrong queen", { position: [3, 0], pieceName: "knight" }, `
    ____.___
    ________
    ___.____
    ________
    ____.___
    ________
    ___.____
    ________
    __._Q___
    ________
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
  `)
];

const longFall: Level[] = [

  level("Tightrope", { position: [0, 0], pieceName: "bishop" }, `
    ______._
    _____.__
    ____.___
    ___.____
    ____.___
    _____.__
    ____.___
    ___.____
    __._____
    _.______
    __._____
    ___.____
    __._____
    _.______
    ._______
  `, { speedUp: TEMPO }),

  level("Blind corner", { position: [0, 0], pieceName: "rook" }, `
    __._____
    __._____
    __._____
    __......
    _______.
    _______.
    ____....
    ____.___
    ____.___
    ____.___
    .....___
    ._______
    ._______
    ._______
  `, { speedUp: TEMPO }),

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
  `, { speedUp: TEMPO })
];

const endgame: Level[] = [

  level("Down to a pawn", { position: [0, 0], pieceName: "rook" }, `
    ____.___
    ____P___
    _____P__
    ____P___
    _____P__
    ____P___
    _____P__
    ____P___
    .....___
    ._______
    ._______
    ._______
  `, { speedUp: TEMPO }),

  level("The gauntlet", { position: [3, 0], pieceName: "queen" }, stack(
    pattern("openGround"),
    shift(pattern("checkerVoid"), 1),
    ".....B..",
    pattern("steppingStones"),
    "...N....",
    pattern("gate"),
    OPEN_ROW
  ), { speedUp: TEMPO }),

  level("Last light", { position: [0, 0], pieceName: "bishop" }, `
    _______.
    _______.
    _______.
    ___.....
    ___.____
    ___.____
    ___R____
    __._____
    _.______
    ._______
    _.______
    __._____
    _.______
    ._______
  `, { speedUp: FAST_TEMPO })
];

export const worlds: World[] = [

  world("First moves", "One rule at a time.", firstMoves),

  world("Trade routes", "What you take is what you become.", tradeRoutes),

  world("The long fall", "Reach is a liability. Every line ends in a hole.", longFall),

  world("Endgame", "Everything at once, and the board is in a hurry.", endgame)
];

export const levels: Level[] = worlds.flatMap(({ levels }) => levels);

export const defaultLevel = levels[0] as Level;

export function worldOf(level: Level): World {

  return worlds.find(({ slug }) => slug === level.world) as World;
}

export function levelBySlug(slug: string | null): Level {

  return levels.find(level => level.slug === slug) ?? defaultLevel;
}

export function randomLevel(
  { columns, rows }: { columns: number; rows: number }
): Level {

  return {
    name: "Random",
    slug: "random",
    world: "",
    columns,
    rows,
    spawn: { position: [3, 0], pieceName: "queen" },
    blueprint: generateLevelBlueprint({ columns, rows })
  };
}
