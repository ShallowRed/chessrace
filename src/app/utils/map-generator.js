export function generateMapBlueprint() {

  const ennemies = ["bishop", "pawn", "knight", "rook",
    "queen"
  ];

  return new Array(30)
    .fill(new Array(8)
      .fill(1)
    )
    .map((array, i) =>
      array.map(() =>
        i < 4 ? 1 :
        !randomBinary() ?
        ennemies[Math.floor(Math.random() * ennemies.length)] :
        randomBinary()
      )
    );
}

function randomBinary() {
  return Math.round((Math.random() + 0.8) / 2);
}
