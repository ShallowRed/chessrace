import { beforeEach, describe, expect, it } from "vitest";

import {
  canvasConfig,
  overhangOf,
  windowHeightOf
} from "app/game-objects/board/board-config";

import PlayArea from "app/game-objects/board/models/play-area";

import type { CanvasName } from "app/game-objects/board/board-config";

const COLUMNS = 8;

const VISIBLE = 12;

const LEVEL = 19;

const FACES = ["frontFaces", "shadows", "bottomFaces", "rightFaces"] as const;

const heightOf = (name: CanvasName) =>
  canvasConfig[name].getDimensions(PlayArea).height ?? 0;

// Each face sits on the floor of its own window, so where it puts the board's
// bottom row is the window's height less everything the face hangs below it.
const floorOf = (name: CanvasName) =>
  windowHeightOf(heightOf(name), PlayArea) - overhangOf(heightOf(name), PlayArea);

describe("the faces of the board", () => {

  beforeEach(() => {
    PlayArea.reservedBottom = 0;
    PlayArea.setDimensions(COLUMNS, VISIBLE, LEVEL, 900, 1400);
  });

  it("gives each face the board's height plus its own overhang", () => {
    const { thickness, offset } = PlayArea;

    expect(overhangOf(heightOf("frontFaces"), PlayArea)).toBe(0);
    expect(overhangOf(heightOf("bottomFaces"), PlayArea)).toBe(thickness);
    expect(overhangOf(heightOf("rightFaces"), PlayArea)).toBe(thickness);
    expect(overhangOf(heightOf("shadows"), PlayArea)).toBe(thickness + offset.shadow);
  });

  // The whole extrusion is this one number agreeing across seven canvases.
  it("lands the bottom row in the same place on every face", () => {
    for (const face of FACES) expect(floorOf(face)).toBe(PlayArea.height);
  });

  it("keeps them lined up however tall the level is", () => {
    for (const rows of [VISIBLE, LEVEL, LEVEL * 3]) {

      PlayArea.setDimensions(COLUMNS, VISIBLE, rows, 900, 1400);

      for (const face of FACES) expect(floorOf(face)).toBe(PlayArea.height);
    }
  });

  it("leaves the lip out of it, since it does not scroll with the board", () => {
    expect(heightOf("lowestBottomFace")).toBe(PlayArea.thickness);
    expect(canvasConfig.lowestBottomFace.inContainer).toBe(false);
  });
});
