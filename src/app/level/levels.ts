import { parseLevelGrid } from 'app/level/level-notation';
import { generateLevelBlueprint } from 'app/utils/level-generator';

import type { Coords, PieceName } from 'app/types';

export interface Level {
  name: string;
  columns: number;
  rows: number;
  spawn: { position: Coords; pieceName: PieceName };
  blueprint: string;
}

const level = (
  name: string,
  spawn: { position: Coords; pieceName: PieceName },
  grid: string
): Level => {

  const rows = grid.split("\n").map(row => row.trim()).filter(Boolean);

  return {
    name,
    columns: (rows[0] as string).length,
    rows: rows.length,
    spawn,
    blueprint: parseLevelGrid(grid)
  };
};

export const levels: Level[] = [

  level("First steps", { position: [3, 0], pieceName: "queen" }, `
    ...__...
    ..____..
    .._N__..
    ..____..
    ...__...
    ...RR...
    ..____..
    ...__...
    ..B__Q..
    ...__...
    ..____..
    ...__...
    ....N...
    ...__...
    ........
    ........
    ........
  `),

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

  level("The gauntlet", { position: [3, 0], pieceName: "queen" }, `
    _._.R._.
    .__..__.
    _.R._.N.
    .__..__.
    _._.B._.
    .__..__.
    Q._._.N.
    .__..__.
    _.B._.R.
    .__..__.
    _._.N._.
    .__..__.
    _.R._.B.
    ........
    ........
    ........
    ........
  `)
];

export const defaultLevel = levels[0] as Level;

export function randomLevel(
  { columns, rows }: { columns: number; rows: number }
): Level {

  return {
    name: "Random",
    columns,
    rows,
    spawn: { position: [3, 0], pieceName: "queen" },
    blueprint: generateLevelBlueprint({ columns, rows })
  };
}
