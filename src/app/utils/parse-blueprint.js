export function parseBlueprint(levelString, columns) {

  return levelString
    .match(new RegExp(`.{1,${columns}}`, 'g'))
    .map(rowString => rowString.split("")
      .map(numberString => parseInt(numberString))
    )
}
