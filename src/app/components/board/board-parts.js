import GameObject from 'app/components/Game-object';
import Canvas from 'app/components/board/Canvas';
import events from 'app/models/events';
import { setStyle } from "app/utils/set-style";

export function create() {

  this.canvas = {};
  this.ctx = {};

  const config = this.parts.getConfig();

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

export function setDimensions(dimensions) {

  setStyle(GameObject.container, dimensions.container)

  for (const name in this.canvas) {

    setCanvasDimensions(
      this.canvas[name],
      dimensions.playableZone,
      dimensions.canvas[name]
    );
  }
}

function setCanvasDimensions(canvas, playableZone, {
  height,
  width,
  bottom = 0,
  left = 0,
} = {}) {

  const { size, depth } = GameObject;

  canvas.setStyle({ width, height, bottom });

  canvas.container?.setStyle({
    width: canvas.width,
    height: canvas.height,
    bottom: playableZone.height - height + size * 2 + depth,
    left
  });
}

export function getDimensions(columns, rows) {

  const { size, depth, offset } = GameObject;

  const playableZone = {
    width: columns * size,
    height: rows * size,
  }

  return {

    playableZone,

    container: {
      width: playableZone.width + depth + offset.shadow,
      height: playableZone.height + size + depth,
      top: depth
    },

    canvas: {
      frontFace: {
        width: playableZone.width,
        height: playableZone.height + size
      },
      shadows: {
        width: playableZone.width,
        height: playableZone.height + size + depth + offset.shadow,
        left: depth + offset.shadow,
      },
      rightFaces: {
        width: playableZone.width - size + depth,
        height: playableZone.height + size + depth,
        left: size,
      },
      bottomFaces: {
        width: playableZone.width + depth,
        height: playableZone.height + size + depth,
      },
      lowestBottomFace: {
        width: playableZone.width + depth,
        height: depth,
        bottom: size,
      }
    }
  };
}
