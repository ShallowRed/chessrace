import { beforeEach, describe, expect, it } from "vitest";

import PlayArea from "app/game-objects/board/models/play-area";

describe("sizing the play area", () => {

  beforeEach(() => {
    PlayArea.reservedBottom = 0;
  });

  it("fits the board to whichever of width or height is tighter", () => {
    PlayArea.setDimensions(8, 12, 900, 700);

    expect(PlayArea.squareSize).toBe(Math.round(700 / 14));

    PlayArea.setDimensions(8, 12, 180, 900);

    expect(PlayArea.squareSize).toBe(Math.round(180 / 9));
  });

  it("derives every other measure from the square size", () => {
    PlayArea.setDimensions(8, 12, 900, 700);

    expect(PlayArea.width).toBe(8 * PlayArea.squareSize);
    expect(PlayArea.height).toBe(12 * PlayArea.squareSize);
    expect(PlayArea.thickness).toBe(Math.round(PlayArea.squareSize / 6));
  });

  it("shrinks the board by the height reserved for the hud", () => {
    PlayArea.setDimensions(8, 12, 900, 700);

    const full = PlayArea.squareSize;

    PlayArea.reservedBottom = 140;
    PlayArea.setDimensions(8, 12, 900, 700);

    expect(PlayArea.squareSize).toBeLessThan(full);
    expect(PlayArea.squareSize).toBe(Math.round((700 - 140) / 14));
  });
});
