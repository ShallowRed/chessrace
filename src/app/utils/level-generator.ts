const { floor, round, random } = Math;

export function generateLevelBlueprint(
  { columns, rows }: { columns: number; rows: number }
): string {

  return Array.from({ length: rows }, (_row, row) =>
    Array.from({ length: columns }, (_column, column) =>
      squareValue(row, column)
    )
  )
    .flat()
    .join('');
}

function squareValue(row: number, column: number): number {

  if (column === 3) return 1;

  if (row < 4 || round(random())) return 1;

  return round(random()) ? 0 : floor(random() * 8);
}
