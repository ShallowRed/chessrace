import Canvas from 'app/components/board/Canvas';
import events from 'app/models/events';

export function create() {

  this.canvas = {};
  this.ctx = {};

  const config = this.boardParts.getConfig();

  for (const name in config) {

    const canvas = new Canvas({ name, ...config[name] });
    
    this.canvas[name] = canvas;
    this.ctx[name] = canvas.ctx;
  }

  this.dynamicCanvas = Object.values(this.canvas)
    .filter(({ name }) => config[name].inContainer !== false);

  this.coloredCanvas = Object.values(this.canvas)
    .filter(({ name }) => config[name].isColored !== false);

  this.canvas.frontFace.onClick(evt => {
    events.emit("SQUARE_CLICKED", this.squares.getClicked(evt));
  });
}

export function getConfig() {

  return {
    frontFace: {
      shape: "square",
      zIndex: 50,
    },
    shadows: {
      shape: "square",
      zIndex: 10,
      isColored: false,
    },
    bottomFaces: {
      shape: "bottomFace",
      zIndex: 20,
      filter: squares => squares
        .filter(this.squares.isNotInBottomRow)
        .filter(this.squares.hasNoTopNeighbour),
    },
    rightFaces: {
      shape: "rightFace",
      zIndex: 30,
      filter: squares =>
        squares.filter(this.squares.hasNoRightNeighbour),
    },
    lowestBottomFace: {
      shape: "lowestBottomFace",
      zIndex: 50,
      inContainer: false,
      filter: squares =>
        squares.filter(this.squares.isInBottomRow),
    }
  }
}
