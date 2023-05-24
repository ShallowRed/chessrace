const { floor, round, random } = Math;
export function generateLevelBlueprint({ columns, rows }) {
    const emptyDeepArray = new Array(rows)
        .fill(new Array(columns)
        .fill(0));
    // const randomDeepArray = emptyDeepArray.map((rows, i) =>
    //   rows.map((col, j) =>
    //     j === 4 ? 1 : round(random())
    //   )
    // );
    // const randomDeepArray = emptyDeepArray.map((rows, i) =>
    //   rows.map((col, j) =>
    //     j === 3 ||
    //     i < 3 ? 1 :
    //     floor(random() * 5) + 3)
    // );
    const randomDeepArray = emptyDeepArray.map((rows, i) => rows.map((_col, j) => j === 3 ? 1 :
        i < 4 || round(random()) ?
            1 : round(random()) ? 0 :
            floor(random() * 8)));
    return randomDeepArray
        .flat()
        .join('');
}
