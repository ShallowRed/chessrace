export function parseBlueprint(levelString, columns) {

  const splitString = new RegExp(`.{1,${columns}}`, 'g');

  return levelString
    .match(splitString)
    .map(rowString => rowString.split("")
      .map(numberString => parseInt(numberString, 10))
    )
}
