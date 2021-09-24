const { min, round } = Math;

export default {

  offset: {},

  setDimensions(columns, rows) {

    this.squareSize = min(
      round(window.innerWidth / (columns + 1)),
      round(window.innerHeight / (rows + 2))
    );

    this.width = columns * this.squareSize;

    this.height = rows * this.squareSize;

    this.offset.depth = round(this.squareSize / 3);

    this.offset.thickness = round(this.squareSize / 6);

    this.input = {
      height: round(this.squareSize / 5),
      thickness: {
        width: round(this.squareSize / 5),
        height: round(this.squareSize / 8)
      }
    }

    this.input.width = this.width + this.input.thickness.width * 2;

    this.input.thickness.full = this.offset.thickness + this.input.thickness.height * 2;

    this.offset.left = this.input.thickness.height + this.input.thickness.width;

    this.offset.top = this.input.height + this.input.thickness.height;
  }
}
