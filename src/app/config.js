const { round, random } = Math;

export const

  translationDuration = 1,
  spriteSpeed = 0.3,

  columns = 8,
  rows = 12,

  startPos = [4, 2],
  startPiece = "queen",


  piecesColors = (() => {
    return round(random()) ? ["white", "black"] : ["black",
      "white"
    ];
  })();
