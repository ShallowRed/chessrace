import PlayArea from 'app/game-objects/board/models/play-area';

export const canvasConfig = {

  frontFaces: {

    zIndex: 40,

    getDimensions: ({ width, height, squareSize, offset }) => ({
      width: width,
      height: height + squareSize,
      left: offset.left
    }),

    shape: {
      type: "frontFace",
      getProps: props => props
    }
  },

  shadows: {

    zIndex: 10,
    isColored: false,

    getDimensions: ({ width, height, squareSize, offset }) => ({
      width: width,
      height: height + squareSize + offset.thickness + offset.depth,
      left: offset.left + offset.thickness + offset.depth
    }),

    shape: {
      type: "frontFace",
      getProps: ({ top, depth, thickness, ...props }) =>
        ({ top: top + thickness + depth, ...props })
    }
  },

  bottomFaces: {

    zIndex: 20,

    getDimensions: ({ width, height, squareSize, offset }) => ({
      width: width + offset.thickness,
      height: height + squareSize + offset.thickness,
      left: offset.left
    }),

    shape: {
      type: "bottomFace",
      getProps: ({ top, height, ...props }) =>
        ({ top: top + height, ...props })
    },

    filter: function(squares) {
      return squares
        .filter(this.isSquare.notInBottomRow)
        .filter(this.isSquare.belowHole)
    }
  },

  rightFaces: {

    zIndex: 30,

    getDimensions: ({ width, height, squareSize, offset }) => ({
      width: width - squareSize + offset.thickness,
      height: height + squareSize + offset.thickness,
      left: squareSize + offset.left,
    }),

    shape: {
      type: "rightFace",
      getProps: ({ left, width, ...props }) =>
        ({ left: left + width - PlayArea.squareSize, ...props }),
    },

    filter: function(squares) {
      return squares.filter(this.isSquare.leftToHole);
    }
  },

  lowestBottomFace: {

    zIndex: 50,
    inContainer: false,

    getDimensions: ({ width, squareSize, offset }) => ({
      width: width + offset.thickness,
      height: offset.thickness,
      bottom: squareSize - offset.thickness,
      left: offset.left,
    }),

    shape: {
      type: "bottomFace",
      getProps: ({ top, ...props }) =>
        ({ top: top * 0, ...props })
    },

    filter: function(squares) {
      return squares.filter(this.isSquare.inBottomRow);
    }
  },

  inputTop: {

    zIndex: 100,
    inContainer: false,
    isColored: false,
    dynamic: false,

    getDimensions: ({ offset , input }) => ({
      width: input.width + input.thickness.full,
      height: offset.top + input.thickness.full - input.thickness.height
    }),
  },

  inputBottom: {

    zIndex: 15,
    inContainer: false,
    isColored: false,
    dynamic: false,

    getDimensions: ({ offset, input }) => ({
      width: input.width + input.thickness.full,
      height: offset.top + input.thickness.full - input.thickness.height
    })
  }
};

export const colors = {

  squares: {

    dark: {
      frontFace: "#ae835a",
      rightFace: "#8b6848",
      bottomFace: "#6f5339"
    },

    light: {
      frontFace: "#f5dbc2",
      rightFace: "#c4af9b",
      bottomFace: "#9c8c7c"
    }
  },

  finishLine: {
    squares: "#333",
    frontFace: "#f0f0f0",
    rightFace: "#BBB",
    bottomFace: "#999",
  },

  shadow: "#EEE"
};
