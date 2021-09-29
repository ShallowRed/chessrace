import PlayArea from 'app/game-objects/board/models/play-area';

export const canvasConfig = {

  frontFaces: {

    zIndex: 40,

    getDimensions: ({ width, height, squareSize, offset }) => ({
      width,
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

    getDimensions: ({ width, height, squareSize, offset, thickness }) => ({
      width,
      height: height + squareSize + thickness + offset.depth,
      left: offset.left + thickness + offset.depth
    }),

    shape: {
      type: "frontFace",
      getProps: ({ top, depth, thickness, ...props }) =>
        ({ top: top + thickness + depth, ...props })
    }
  },

  bottomFaces: {

    zIndex: 20,

    getDimensions: ({ width, height, thickness, squareSize, offset }) => ({
      width: width + thickness,
      height: height + squareSize + thickness,
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

    getDimensions: ({ width, height, squareSize, thickness, offset }) => ({
      width: width - squareSize + thickness,
      height: height + squareSize + thickness,
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

    getDimensions: ({ width, squareSize, offset, thickness }) => ({
      width: width + thickness,
      height: thickness,
      bottom: squareSize - thickness,
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

    getDimensions: ({ offset, input }) => ({
      width: input.width + input.thickness,
      height: offset.top + input.thickness - input.edgeToHole.thickness
    }),
  },

  inputBottom: {

    zIndex: 15,
    inContainer: false,
    isColored: false,
    dynamic: false,

    getDimensions: ({ offset, input }) => ({
      width: input.width + input.thickness,
      height: offset.top + input.thickness - input.edgeToHole.thickness
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
