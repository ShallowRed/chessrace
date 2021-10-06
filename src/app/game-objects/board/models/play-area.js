const { max, min, round } = Math;

export default {

  offset: {},

  input: {},

  squareSizeRatios: {

    BOARD_THICKNESS: 1 / 6,
    BOARD_OFFSET_DEPTH: 1 / 3,

    INPUT_HEIGHT: 1 / 5,
    INPUT_EDGETOHOLE_WIDTH: 1 / 10,
    INPUT_EDGETOHOLE_THICKNESS: 1 / 16,
  },

  getSquareRatio(key) {

    return round(this.squareSize * this.squareSizeRatios[key]);
  },

  setDimensions(columns, rows) {

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

  setInputDimensions({ width, thickness, input } = this) {

    input.height = this.getSquareRatio("INPUT_HEIGHT");

    input.edgeToHole = {

      width: this.getSquareRatio("INPUT_EDGETOHOLE_WIDTH"),

      thickness: this.getSquareRatio("INPUT_EDGETOHOLE_THICKNESS")
    };

    input.width = width + input.edgeToHole.width * 2;

    input.thickness = thickness + input.edgeToHole.thickness * 2;
  },

  setOffsetDimensions({ input, offset } = this) {

    offset.depth = this.getSquareRatio("BOARD_OFFSET_DEPTH");

    offset.left = input.edgeToHole.thickness + input.edgeToHole.width;

    offset.right = max(offset.left, offset.depth);

    offset.top = input.height + input.edgeToHole.thickness;
  }
}
