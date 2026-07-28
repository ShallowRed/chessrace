const { round, random } = Math;

export function getRandomPiecesColor() {

  const colors = ["white", "black"];

  const randomBool = round(random());

  return [colors[randomBool], colors[1 - randomBool]]
}
