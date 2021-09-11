import GameObject from 'app/components/Game-object';

export const frontFaces = {

  shape: "frontFace",
  zIndex: 50,

  dimensions: ({ width, height }, { size }) => ({
    width,
    height: height + size
  }),

  getShapeProps: props => props
};


export const shadows = {

  shape: "frontFace",
  zIndex: 10,
  isColored: false,

  dimensions: ({ width, height }, { size, offset, depth }) => ({
    width,
    height: height + size + depth + offset.shadow,
    left: depth + offset.shadow
  }),

  getShapeProps: ({ left, top, width, height, depth, offset }) =>
    ({ left, top: top + depth + offset.shadow, width, height })
};


export const bottomFaces = {

  shape: "bottomFace",
  zIndex: 20,

  dimensions: ({ width, height }, { size, depth }) => ({
    width: width + depth,
    height: height + size + depth,
  }),

  getShapeProps: ({ top, left, height, width, depth }) =>
    ({ left, top: top + height, width, depth }),

  filter: function(squares) {
    return squares
      .filter(this.square.is.notInBottomRow)
      .filter(this.square.is.belowHole)
  },
};


export const rightFaces = {

  shape: "rightFace",
  zIndex: 30,
  dimensions: ({ width, height }, { size, depth }) => ({
    width: width - size + depth,
    height: height + size + depth,
    left: size,
  }),

  getShapeProps: ({ left, top, width, height, depth }) =>
    ({ left: left + width - GameObject.size, top, height, depth }),

  filter: function(squares) {
    return squares.filter(this.square.is.leftToHole);
  },
};


export const lowestBottomFace = {

  shape: "bottomFace",
  zIndex: 50,
  inContainer: false,

  dimensions: ({ width }, { size, depth }) => ({
    width: width + depth,
    height: depth,
    bottom: size,
  }),

  getShapeProps: ({ left, width, depth }) =>
    ({ left, top: 0, width, depth }),

  filter: function(squares) {
    return squares.filter(this.square.is.inBottomRow);
  }
};
