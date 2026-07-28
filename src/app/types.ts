export type Coords = [col: number, row: number];

export type PieceName =
  "bishop" | "king" | "knight" | "pawn" | "queen" | "rook";

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
