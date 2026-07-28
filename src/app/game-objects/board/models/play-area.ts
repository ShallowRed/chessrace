const { max, min, round } = Math;

export type SquareSizeRatio =
  | "BOARD_THICKNESS"
  | "BOARD_OFFSET_SHADOW"
  | "INPUT_HEIGHT"
  | "INPUT_EDGETOHOLE_WIDTH"
  | "INPUT_EDGETOHOLE_THICKNESS";

export interface Input {
  height: number;
  width: number;
  thickness: number;
  edgeToHole: {
    width: number;
    thickness: number;
  };
}

export interface Offset {
  top: number;
  left: number;
  right: number;
  shadow: number;
}

export default {

  squareSize: 0,

  width: 0,

  height: 0,

  thickness: 0,

  offset: {
    top: 0,
    left: 0,
    right: 0,
    shadow: 0
  },

  input: {
    height: 0,
    width: 0,
    thickness: 0,
    edgeToHole: {
      width: 0,
      thickness: 0
    }
  },

  squareSizeRatios: {

    BOARD_THICKNESS: 1 / 6,
    BOARD_OFFSET_SHADOW: 1 / 3,

    INPUT_HEIGHT: 1 / 5,
    INPUT_EDGETOHOLE_WIDTH: 1 / 10,
    INPUT_EDGETOHOLE_THICKNESS: 1 / 16,

  } as Record<SquareSizeRatio, number>,

  getSquareRatio(key: SquareSizeRatio): number {

    return round(this.squareSize * this.squareSizeRatios[key]);
  },

  setDimensions(columns: number, rows: number): void {

    this.squareSize = min(
      round(window.innerWidth / (columns + 1)),
      round(window.innerHeight / (rows + 2))
    );


    this.width = columns * this.squareSize;

    this.height = rows * this.squareSize;

    this.thickness = this.getSquareRatio("BOARD_THICKNESS");


    this.setInputDimensions();

    this.setOffsetDimensions();
  },

  setInputDimensions(): void {

    const { input } = this;

    input.height = this.getSquareRatio("INPUT_HEIGHT");

    input.edgeToHole = {

      width: this.getSquareRatio("INPUT_EDGETOHOLE_WIDTH"),

      thickness: this.getSquareRatio("INPUT_EDGETOHOLE_THICKNESS")
    };

    input.width = this.width + input.edgeToHole.width * 2;

    input.thickness = this.thickness + input.edgeToHole.thickness * 2;
  },

  setOffsetDimensions(): void {

    const { input, offset } = this;

    offset.shadow = this.getSquareRatio("BOARD_OFFSET_SHADOW");

    offset.left = input.edgeToHole.thickness + input.edgeToHole.width;

    offset.right = max(offset.left, offset.shadow);

    offset.top = input.height + input.edgeToHole.thickness;
  }
}
