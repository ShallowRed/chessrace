import { describe, expect, it } from "vitest";

import { beforeTheEndOf, ms } from "app/utils/timing";

describe("timing", () => {

  it("turns seconds into milliseconds", () => {
    expect(ms(0.3)).toBe(300);
    expect(ms(2)).toBe(2000);
  });

  it("lands cleanup inside the move it belongs to", () => {
    expect(beforeTheEndOf(0.3)).toBeLessThan(ms(0.3));
    expect(beforeTheEndOf(0.3)).toBe(240);
  });
});
