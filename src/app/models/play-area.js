const { min, round } = Math;

export default {

  offset: {},

  setDimensions(columns, rows) {

    this.size = min(
      round(window.innerWidth / (columns + 1)),
      round(window.innerHeight / (rows + 2))
    );

    this.width = columns * this.size;

    this.height = rows * this.size;

    this.offset.depth = round(this.size / 3);

    this.offset.thickness = round(this.size / 6);

    this.input = {
      height: round(this.size / 1.5),
      thickness: {
        width: round(this.size / 5),
        height: round(this.size / 8)
      }
    }

    this.input.width = this.width + this.input.thickness.width * 2;

    this.input.thickness.full = this.offset.thickness + this.input.thickness.height * 2;

    this.offset.left = this.input.thickness.height + this.input.thickness.width;

    this.offset.top = this.input.height + this.input.thickness.height;
  }
}
