export type Coords = [col: number, row: number];

// Order matters: a blueprint stores a piece as its index here, offset by 2.
export const PIECE_NAMES = [
  "bishop", "king", "knight", "pawn", "queen", "rook"
] as const;

export type PieceName = typeof PIECE_NAMES[number];

export type PieceColor = "white" | "black";

export type FaceType = "frontFace" | "rightFace" | "bottomFace";

export interface PiecePlacement {
  pieceName: PieceName;
  position: Coords;
}

export interface Durations {
  move: number;
  scroll: number;
  fall: number;
  speedUp: number;
  minScroll: number;
}

export interface BoardDimensions {
  columns: number;
  rows: number;
  visibleRows: number;
}

export interface LevelConfig {
  board: BoardDimensions;
  blueprint: string;
  playerSpawn: PiecePlacement;
  durations: Durations;
}

export interface Shape {
  left: number;
  top: number;
  width: number;
  height: number;
  thickness: number;
  offsetShadow: number;
}

export type ShapeInput = Partial<Shape>;

export interface Dimensions {
  width?: number;
  height?: number;
  top?: number;
  bottom?: number;
  left?: number;
}

export type Bound<T> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown
    ? OmitThisParameter<T[K]>
    : Bound<T[K]>;
};

export type RunOutcome = "won" | "lost";

export interface RunResult {
  outcome: RunOutcome;
  moves: number;
}
