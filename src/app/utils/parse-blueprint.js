export function parseBlueprint(levelBlueprint, columns) {

  const columnsRegExp = `.{1,${columns}}`;

  return levelBlueprint
    .match(new RegExp(columnsRegExp, 'g'))
    .map(rowString => rowString.split("")
      .map(numberString => parseInt(numberString))
    )
}
