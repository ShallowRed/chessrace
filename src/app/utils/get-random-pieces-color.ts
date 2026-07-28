import type { PieceColor } from "app/types";

const { round, random } = Math;

export function getRandomPiecesColor(): [PieceColor, PieceColor] {

  return round(random())
    ? ["black", "white"]
    : ["white", "black"];
}
