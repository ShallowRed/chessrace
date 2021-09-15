import GameObject from 'app/components/Game-object';

export const canvas = {

  frontFaces: {

    zIndex: 50,

    dimensions: ({ playArea, size }) => ({
      width: playArea.width,
      height: playArea.height + size
    }),

    shape: {
      type: "frontFace",
      get: props => props
    }
  },

  shadows: {

    zIndex: 10,
    isColored: false,

    dimensions: ({ playArea, size, shadowOffset, depth }) => ({
      width: playArea.width,
      height: playArea.height + size + depth + shadowOffset,
      left: depth + shadowOffset
    }),

    shape: {
      type: "frontFace",
      get: ({ left, top, width, height, depth, shadowOffset }) =>
        ({ left, top: top + depth + shadowOffset, width, height })
    },

    getShapeProps: ({ left, top, width, height, depth, shadowOffset }) =>
      ({ left, top: top + depth + shadowOffset, width, height })
  },

  bottomFaces: {

    zIndex: 20,

    dimensions: ({ playArea, size, depth }) => ({
      width: playArea.width + depth,
      height: playArea.height + size + depth,
    }),

    shape: {
      type: "bottomFace",
      get: ({ top, left, height, width, depth }) =>
        ({ left, top: top + height, width, depth })
    },

    filter: function(squares) {
      return squares
        .filter(this.square.is.notInBottomRow)
        .filter(this.square.is.belowHole)
    }
  },

  rightFaces: {

    zIndex: 30,

    dimensions: ({ playArea, size, depth }) => ({
      width: playArea.width - size + depth,
      height: playArea.height + size + depth,
      left: size,
    }),

    shape: {
      type: "rightFace",
      get: ({ left, top, width, height, depth }) =>
        ({ left: left + width - GameObject.size, top, height, depth }),
    },

    filter: function(squares) {
      return squares.filter(this.square.is.leftToHole);
    }
  },

  lowestBottomFace: {

    zIndex: 50,
    inContainer: false,

    dimensions: ({ playArea, size, depth }) => ({
      width: playArea.width + depth,
      height: depth,
      bottom: size,
    }),

    shape: {
      type: "bottomFace",
      get: ({ left, width, depth }) =>
        ({ left, top: 0, width, depth }),
    },

    filter: function(squares) {
      return squares.filter(this.square.is.inBottomRow);
    }
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
