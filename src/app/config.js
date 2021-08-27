const { round, ceil, min, random } = Math;

export const

  columns = 8,
  visibleRows = 12,
  boardRows = 30,

  squareSize = ceil(min(window.innerWidth * 0.7, 500) / columns),
  shadowShift = round(squareSize / 4),

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
