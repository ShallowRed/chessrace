import type { Durations } from 'app/types';

// How many rows of the board are on screen at once. A level shorter than this
// is visible in full from the start.
export const VISIBLE_ROWS = 12;

export const DURATIONS: Durations = {
  move: 0.3,
  scroll: 2,
  fall: 1,
  speedUp: 1,
  minScroll: 0.9
};

// How much faster each climbed row makes the board scroll, for the levels that
// ask for it.
export const TEMPO = 0.93;

// For a short level, where the board can afford to close in harder.
export const FAST_TEMPO = 0.88;

// Moves over the shortest route still worth two stars. Beyond that, one.
export const NEAR_ENOUGH = 2;
