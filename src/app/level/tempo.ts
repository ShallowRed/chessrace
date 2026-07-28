import type { Durations } from 'app/types';

export function scrollDuration(
  { scroll, speedUp, minScroll }: Durations,
  rowsClimbed: number
): number {

  return Math.max(minScroll, scroll * speedUp ** rowsClimbed);
}
