const { floor, round, random } = Math;

export function generateLevelBlueprint({ columns, rows }) {

  const emptyDeepArray = new Array(rows)
    .fill(new Array(columns)
      .fill()
    );

  // const randomDeepArray = emptyDeepArray.map((rows, i) =>
  //   rows.map(() =>
  //     i < 1 ? 1 : round(random())
  //   )
  // );
  const randomDeepArray = emptyDeepArray.map((rows, i) =>
    rows.map(() =>
      i < 4 || round(random()) ?
      1 : round(random()) ? 0 :
      floor(random() * 7))
  );

  const levelString = randomDeepArray
    .flat()
    .join('');

  return { rows, columns, levelString }
}
