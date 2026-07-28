import { readBoard, solve } from 'app/level/solve';
import { scrollDuration } from 'app/level/tempo';

import type { Board } from 'app/level/solve';
import type { Durations, PiecePlacement } from 'app/types';

// A run ends one of three ways. Falling down a hole is not among them: a
// persona only ever picks from the moves the rules allow, so it is a mistake
// no simulated player makes. Only a human does that.
export type Outcome = "won" | "caught" | "stuck";

export interface Playthrough {
  persona: string;
  outcome: Outcome;
  moves: number;
  rowsClimbed: number;
}

export interface Persona {
  name: string;
  // Seconds this player takes to read the board and commit to a move.
  secondsPerMove: number;
  choose: (
    options: PiecePlacement[],
    board: Board,
    from: PiecePlacement
  ) => PiecePlacement;
}

const rowOf = ({ position }: PiecePlacement) => position[1];

const best = <T>(items: T[], score: (item: T) => number): T =>
  items.reduce((a, b) => (score(b) > score(a) ? b : a));

// Without this a greedy player ping-pongs between two squares for ever: from
// here the best is there, and from there the best is here.
const forward = (options: PiecePlacement[], from: PiecePlacement) => {

  const climbing = options.filter(option => rowOf(option) > rowOf(from));

  return climbing.length ? climbing : options;
};

export const PERSONAS: Persona[] = [

  {
    name: "climber",
    secondsPerMove: 1.2,
    choose: (options, _board, from) => best(forward(options, from), rowOf)
  },

  {
    name: "magpie",
    secondsPerMove: 1.2,
    choose: (options, board, from) => best(forward(options, from),
      option => (board.isEnemy(option.position) ? 100 : 0) + rowOf(option))
  },

  {
    name: "cautious",
    secondsPerMove: 1.2,
    choose: (options, board, from) => best(forward(options, from),
      option => board.movesFrom(option).length)
  },

  {
    name: "dawdler",
    secondsPerMove: 2.6,
    choose: (options, _board, from) => best(forward(options, from), rowOf)
  }
];

export function playthrough(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement,
  durations: Durations,
  persona: Persona
): Playthrough {

  const board = readBoard(blueprint, columns);

  let state: PiecePlacement = { ...spawn };

  let bottom = 0;

  let moves = 0;

  let clock = 0;

  let nextMove = persona.secondsPerMove;

  let nextScroll = scrollDuration(durations, bottom);

  const report = (outcome: Outcome): Playthrough =>
    ({ persona: persona.name, outcome, moves, rowsClimbed: rowOf(state) });

  // The board and the player run on their own clocks; whichever is due next
  // takes its turn. Acceleration makes the board's turns come round faster.
  while (clock < board.rows * 60) {

    if (nextMove <= nextScroll) {

      clock = nextMove;

      const options = board.movesFrom(state);

      if (!options.length) return report("stuck");

      state = persona.choose(options, board, state);

      moves++;

      if (rowOf(state) === board.rows) return report("won");

      nextMove = clock + persona.secondsPerMove;

    } else {

      clock = nextScroll;

      bottom++;

      if (rowOf(state) < bottom) return report("caught");

      nextScroll = clock + scrollDuration(durations, bottom);
    }
  }

  return report("stuck");
}

// A player who already knows the shortest route, at a human pace. It is the
// line that tells the two failures apart: if this one is caught the level
// cannot be finished in time by anyone, and if only this one gets through the
// level cannot be worked out on the way up.
export function planner(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement,
  secondsPerMove = 1.2
): Persona {

  const route = solve(blueprint, columns, spawn)?.moves ?? [];

  let step = 0;

  return {
    name: "planner",
    secondsPerMove,
    choose: (options) => {

      const wanted = route[step++];

      return options
        .find(({ position: [col, row] }) =>
          col === wanted?.[0] && row === wanted[1]) ?? (options[0] as PiecePlacement);
    }
  };
}

export function playthroughs(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement,
  durations: Durations
): Playthrough[] {

  return [planner(blueprint, columns, spawn), ...PERSONAS]
    .map(persona => playthrough(blueprint, columns, spawn, durations, persona));
}

// How much room the board leaves: rows the player can afford to lose before
// the bottom edge reaches them, at the pace the level scrolls.
export function slack(
  blueprint: number[][],
  columns: number,
  spawn: PiecePlacement,
  durations: Durations
): number {

  const shortest = solve(blueprint, columns, spawn)?.moves.length;

  if (shortest === undefined) return 0;

  const seconds = Array
    .from({ length: blueprint.length }, (_none, row) =>
      scrollDuration(durations, row))
    .reduce((total, step) => total + step, 0);

  return Math.round(seconds / shortest * 10) / 10;
}
