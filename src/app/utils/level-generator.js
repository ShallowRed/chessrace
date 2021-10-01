const { floor, round, random } = Math;

export function generateLevelBlueprint({ columns, rows }) {

  const emptyDeepArray = new Array(rows)
    .fill(new Array(columns)
      .fill()
    );

  // const randomDeepArray = emptyDeepArray.map((rows, i) =>
  //   rows.map((col, j) =>
  //     j === 4 ? 1 : round(random())
  //   )
  // );

  const randomDeepArray = emptyDeepArray.map((rows, i) =>
    rows.map((col, j) =>
      j === 3 ? 1 :
      i < 4 || round(random()) ?
      1 : round(random()) ? 0 :
      floor(random() * 7))
  );

  return randomDeepArray
    .flat()
    .join('');
}
