import { PIECE_NAMES } from 'app/types';

import type { PieceName } from 'app/types';

export const HOLE = "_";

export const SQUARE = ".";

export const PIECE_SYMBOLS: Record<string, PieceName> = {
  B: "bishop",
  K: "king",
  N: "knight",
  P: "pawn",
  Q: "queen",
  R: "rook"
};

export function parseLevelGrid(grid: string): string {

  const rows = grid
    .split("\n")
    .map(row => row.trim())
    .filter(Boolean);

  if (!rows.length) {

    throw new Error("a level grid needs at least one row");
  }

  const columns = (rows[0] as string).length;

  const ragged = rows.find(row => row.length !== columns);

  if (ragged !== undefined) {

    throw new Error(`every row must be ${columns} squares wide, got "${ragged}"`);
  }

  return rows
    .reverse()
    .map(row => [...row].map(symbolToValue).join(""))
    .join("");
}

function symbolToValue(symbol: string): number {

  if (symbol === HOLE) return 0;

  if (symbol === SQUARE) return 1;

  const pieceName = PIECE_SYMBOLS[symbol];

  if (!pieceName) {

    throw new Error(`unknown level symbol "${symbol}"`);
  }

  return PIECE_NAMES.indexOf(pieceName) + 2;
}
