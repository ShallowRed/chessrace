export function parseBlueprint(levelString: string, columns: number): number[][] {

  const splitString = new RegExp(`.{1,${columns}}`, 'g');

  return (levelString.match(splitString) ?? [])
    .map(rowString => rowString.split("")
      .map(numberString => parseInt(numberString, 10))
    );
}
