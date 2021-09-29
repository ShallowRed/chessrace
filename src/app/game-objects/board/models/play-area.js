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


    this.thickness = round(this.squareSize / 6);

    this.offset.depth = round(this.squareSize / 3);


    const { edgeToHole } = this.input = getInput(this);
    

    this.offset.left = edgeToHole.thickness + edgeToHole.width;

    this.offset.top = this.input.height + edgeToHole.thickness;
  }
}

function getInput({ width, thickness, squareSize }) {

  const height = round(squareSize / 5);

  const edgeToHole = {

    width: round(squareSize / 5),

    thickness: round(squareSize / 8)
  };

  return {
    height,
    edgeToHole,
    width: width + edgeToHole.width * 2,
    thickness: thickness + edgeToHole.thickness * 2
  };
}
