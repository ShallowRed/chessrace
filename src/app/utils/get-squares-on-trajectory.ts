import type { Coords } from "app/types";

const { abs, sign, max } = Math;

export function getSquaresOnTrajectory(
  [x1, y1]: Coords,
  [x2, y2]: Coords
): Coords[] {

  const deltaLength = max(
    abs(x2 - x1),
    abs(y2 - y1)
  );

  const getSquareOnTrajectory = (_square: unknown, i: number): Coords => ([
    x1 + sign(x2 - x1) * (i + 1),
    y1 + sign(y2 - y1) * (i + 1)
  ]);

  return new Array(max(deltaLength - 1, 0))
    .fill(undefined)
    .map(getSquareOnTrajectory);
}
