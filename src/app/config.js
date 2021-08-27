const { round, random } = Math;

export const

  columns = 8,
  rows = 12,

  darkColor = "#ae835a",
  lightColor = "#f5dbc2",

  startPos = [4, 2],
  startPiece = "queen",

  translationDuration = 1,

  piecesColors = (() => {
    return round(random()) ? ["white", "black"] : ["black",
      "white"
    ];
  })();
