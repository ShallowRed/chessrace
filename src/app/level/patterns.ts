import { HOLE } from 'app/level/notation';

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
    intent: "An enemy plugging the only corridor. A knight holds no square in line with itself, so it is the one gate that can be taken head on.",
    crossableBy: ["king", "queen", "rook"],
    grid: `
      ___.____
      ___N____
      ___.____
    `
  },

  {
    name: "portcullis",
    kind: "pieces",
    intent: "A rook owning the corridor it stands in. Nothing walks up to it, and only the knight can jump the squares it holds.",
    crossableBy: ["knight"],
    grid: `
      ___.____
      ___R____
      ___.____
    `
  },

  {
    name: "shoulder",
    kind: "pieces",
    intent: "A rook holding its own corridor, with just enough room beside it. Nothing walks up to it in line, so it has to be taken on the diagonal.",
    crossableBy: ["bishop", "king", "knight", "pawn", "queen"],
    grid: `
      __...___
      ___R____
      __...___
    `
  },

  {
    name: "crossfire",
    kind: "pieces",
    intent: "Two rooks holding the rank between them. The rank cannot be walked, only jumped or bought with a capture.",
    crossableBy: ["bishop", "knight", "queen", "rook"],
    grid: `
      ........
      R......R
      ........
    `
  },

  {
    name: "shadow",
    kind: "pieces",
    intent: "A hole cuts the queen's line, and everything past it is safe. The terrain that kills is also the terrain that shelters.",
    crossableBy: ["bishop", "king", "knight", "queen", "rook"],
    grid: `
      ......._
      ....Q_..
      ......._
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
    crossableBy: ["bishop", "king", "pawn", "queen", "rook"],
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
