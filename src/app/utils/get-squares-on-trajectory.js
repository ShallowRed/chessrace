const { abs, sign, max } = Math;

export function getSquaresOnTrajectory([x1, y1], [x2, y2]) {

  const deltaLength = max(
    abs(x2 - x1),
    abs(y2 - y1)
  );

  const getSquareOnTrajectory = (e, i) => ([
    x1 + sign(x2 - x1) * (i + 1),
    y1 + sign(y2 - y1) * (i + 1)
  ]);

  return new Array(deltaLength - 1)
    .fill()
    .map(getSquareOnTrajectory)
}
