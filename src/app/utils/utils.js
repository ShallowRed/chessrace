const { abs, sign, max, round, random } = Math;

export function getSquaresOnTrajectory([x, y], [tx, ty]) {

  const deltaLength = max(
    abs(tx - x),
    abs(ty - y)
  );

  const getSquareOnTrajectory = (e, i) => ([
    x + sign(tx - x) * (i + 1),
    y + sign(ty - y) * (i + 1)
  ]);

  return new Array(deltaLength - 1)
    .fill()
    .map(getSquareOnTrajectory)
}

export function translateY(element, { distance, duration }) {
  element.style.transitionDuration = `${duration}s`;
  element.style.transform = `translateY(${distance}px)`;
}

export function filterMap(array, { filter, map }) {

  return array.map((value, index) => {
      return filter({ value, index }) && ({ value, index });
    })
    .filter(({ index }) => typeof index === "number")
    .map(map)
}

export function getRandomPiecesColor() {

  const colors = ["white", "black"];

  const randomBool = round(random());

  return [colors[randomBool], colors[1 - randomBool]]
}
