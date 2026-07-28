import { describe, expect, it } from "vitest";

import { scrollDuration } from "app/level/tempo";

import type { Durations } from "app/types";

const durations = (speedUp: number, minScroll = 0.9): Durations =>
  ({ move: 0.3, scroll: 2, fall: 1, speedUp, minScroll });

describe("scrollDuration", () => {

  it("holds steady when the level does not speed up", () => {
    const steady = durations(1);

    expect(scrollDuration(steady, 0)).toBe(2);
    expect(scrollDuration(steady, 20)).toBe(2);
  });

  it("starts at the level's own pace", () => {
    expect(scrollDuration(durations(0.93), 0)).toBe(2);
  });

  it("tightens as the player climbs", () => {
    const climbing = durations(0.93);

    expect(scrollDuration(climbing, 5))
      .toBeLessThan(scrollDuration(climbing, 1));
  });

  it("never drops below the floor", () => {
    const climbing = durations(0.93, 0.9);

    expect(scrollDuration(climbing, 200)).toBe(0.9);
  });
});
