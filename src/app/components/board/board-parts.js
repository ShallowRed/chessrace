import Canvas from 'app/components/board/Canvas';
import events from 'app/models/events';

export function create() {

  this.canvas = {};
  this.ctx = {};

  this.boardParts.canvas.getProps()
    .forEach(this.boardParts.canvas.create);

  this.dynamicCanvas = Object.entries(this.canvas)
    .filter(([, canvas]) => canvas.inContainer);

  this.coloredCanvas = Object.entries(this.canvas)
    .filter(([, canvas]) => canvas.isColored);

  this.canvas.frontFace.onClick(evt => {
    events.emit("SQUARE_CLICKED", this.squares.getClicked(evt))
  });
}

export const canvas = {

  create({ inContainer = true, isColored = true, ...props }) {

    const canvas = new Canvas({ inContainer, isColored, ...props });

    this.canvas[canvas.name] = canvas;
    this.ctx[canvas.name] = canvas.ctx;
  },

  getProps() {

    return [{
      name: "shadows",
      shape: "square",
      isColored: false,
    }, {
      name: "bottomFaces",
      shape: "bottomFace",
      filter: squares => squares
        .filter(this.squares.isNotInBottomRow)
        .filter(this.squares.hasNoTopNeighbour),
    }, {
      name: "rightFaces",
      shape: "rightFace",
      filter: squares =>
        squares.filter(this.squares.hasNoRightNeighbour),
    }, {
      name: "frontFace",
      shape: "square"
    }, {
      name: "lowestBottomFace",
      shape: "lowestBottomFace",
      inContainer: false,
      filter: squares =>
        squares.filter(this.squares.isInBottomRow),
    }]
  }
}
