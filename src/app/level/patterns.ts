import { HOLE } from 'app/level/level-notation';

import type { PieceName } from 'app/types';

export interface Pattern {
  name: string;
  kind: "terrain" | "pieces";
  intent: string;
  grid: string;
  crossableBy: PieceName[];
}

export function stack(...fragments: string[]): string {

  return fragments
    .map(fragment => fragment
      .split("\n")
      .map(row => row.trim())
      .filter(Boolean)
      .join("\n"))
    .join("\n");
}

const rowsOf = (fragment: string) => fragment
  .split("\n")
  .map(row => row.trim())
  .filter(Boolean);

export function shift(fragment: string, offset: number): string {

  return rowsOf(fragment)
    .map(row => Array
      .from(row, (_square, column) => row[column - offset] ?? HOLE)
      .join(""))
    .join("\n");
}

export function mirror(fragment: string): string {

  return rowsOf(fragment)
    .map(row => [...row].reverse().join(""))
    .join("\n");
}

export const patterns: Pattern[] = [

  {
    name: "openGround",
    kind: "terrain",
    intent: "Breathing room between two demands, and the only place a long range piece can open up.",
    crossableBy: ["bishop", "king", "knight", "pawn", "queen", "rook"],
    grid: `
      ........
      ........
    `
  },

  {
    name: "laneChasm",
    kind: "terrain",
    intent: "Funnels every form into a single column, and denies the diagonal.",
    crossableBy: ["king", "knight", "pawn", "queen", "rook"],
    grid: `
      ___.____
      ___.____
      ___.____
    `
  },

  {
    name: "comb",
    kind: "terrain",
    intent: "Vertical lanes with no way across: whichever column you enter is the one you leave.",
    crossableBy: ["king", "knight", "pawn", "queen", "rook"],
    grid: `
      ._._._._
      ._._._._
      ._._._._
    `
  },

  {
    name: "checkerVoid",
    kind: "terrain",
    intent: "Only diagonal movers survive. A knight flips square colour every jump, so it always lands in a hole. Needs depth: a shallow one is hopped straight onto the finishing line.",
    crossableBy: ["bishop", "king", "queen"],
    grid: `
      _._._._.
      ._._._._
      _._._._.
      ._._._._
      _._._._.
    `
  },

  {
    name: "steppingStones",
    kind: "terrain",
    intent: "Islands spaced a knight move apart. Nothing else reaches them.",
    crossableBy: ["knight"],
    grid: `
      ___.____
      ________
      __._____
      ________
    `
  },

  {
    name: "gate",
    kind: "pieces",
    intent: "An enemy plugging the only corridor: a long range piece is stopped by it and has to take it to pass.",
    crossableBy: ["king", "knight", "queen", "rook"],
    grid: `
      ___.____
      ___R____
      ___.____
    `
  },

  {
    name: "bait",
    kind: "pieces",
    intent: "A weak enemy sitting on the obvious path. Taking it is legal, cheap, and costs you your form.",
    crossableBy: ["bishop", "king", "knight", "pawn", "queen", "rook"],
    grid: `
      ........
      ........
      ...P....
    `
  },

  {
    name: "ladder",
    kind: "pieces",
    intent: "A chain of captures where each form is only good enough to reach the next one. The rungs are spaced so the form a rung grants cannot skip ahead to the one after it.",
    crossableBy: ["bishop", "king", "knight", "pawn", "queen", "rook"],
    grid: `
      __._____
      __R_____
      ________
      _N______
    `
  }
];

export const patternsByName = new Map(
  patterns.map(pattern => [pattern.name, pattern])
);

export function pattern(name: string): string {

  const found = patternsByName.get(name);

  if (!found) {

    throw new Error(`unknown pattern "${name}"`);
  }

  return found.grid;
}
