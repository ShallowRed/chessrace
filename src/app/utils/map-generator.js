import { columns, boardRows } from "app/config";

const { floor, round, random } = Math;

export function generateMapBlueprint() {

  const ennemies = ["bishop", "pawn", "knight", "rook",
    "queen"
  ];

  return new Array(boardRows)
    .fill(new Array(columns)
      .fill()
    )
    .map((array, i) =>
      array.map(() =>
        i < 4 ? 1 :
        !randomBinary() ?
        ennemies[floor(random() * ennemies.length)] :
        randomBinary()
      )
    );
}

function randomBinary() {
  return round((random() + 0.8) / 2);
}
