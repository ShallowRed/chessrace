import PlayArea from 'app/game-objects/board/models/play-area';

import type Board from 'app/game-objects/board/board';
import type { Coords, Dimensions, FaceType, Shape } from 'app/types';

export interface CanvasConfig {
  zIndex: number;
  inContainer?: boolean;
  isColored?: boolean;
  dynamic?: boolean;
  getDimensions: (playArea: typeof PlayArea) => Dimensions;
  shape?: {
    type: FaceType;
    getProps: (shape: Shape) => Shape;
  };
  filter?: (this: Board, squares: Coords[]) => Coords[];
}

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
      height: height + squareSize + thickness + offset.shadow,
      left: offset.left + thickness + offset.shadow
    }),

    shape: {
      type: "frontFace",
      getProps: ({ top, offsetShadow, thickness, ...props }) =>
        ({ ...props, thickness, offsetShadow, top: top + thickness + offsetShadow })
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
        ({ ...props, height, top: top + height })
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
        ({ ...props, width, left: left + width - PlayArea.squareSize }),
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
        ({ ...props, top: top * 0 })
    },

    filter: function(squares) {

      return squares.filter(this.isSquare.inBottomRow);
    }
  },

  inputFront: {

    zIndex: 100,
    inContainer: false,
    isColored: false,
    dynamic: false,

    getDimensions: ({ offset, input }) => ({
      width: input.width + input.thickness,
      height: offset.top + input.thickness - input.edgeToHole.thickness
    }),
  },

  inputRear: {

    zIndex: 15,
    inContainer: false,
    isColored: false,
    dynamic: false,

    getDimensions: ({ offset, input }) => ({
      width: input.width + input.thickness,
      height: offset.top + input.thickness - input.edgeToHole.thickness
    })
  }

} satisfies Record<string, CanvasConfig>;

export type CanvasName = keyof typeof canvasConfig;

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

  held: {

    dark: {
      frontFace: "#9c5a52",
      rightFace: "#7d4842",
      bottomFace: "#643a35"
    },

    light: {
      frontFace: "#e0a49a",
      rightFace: "#b4837c",
      bottomFace: "#8f6963"
    }
  },

  finishLine: {
    squares: "#333",
    frontFace: "#f0f0f0",
    rightFace: "#BBB",
    bottomFace: "#999",
  },

  shadow: "#EEE",

  input: {
    light: "#babbc5",
    medium: "#909199",
    dark: "#67686d",
    xDark: "#3e3e41",
    xxDark: "#29292b"
  }

} satisfies {
  squares: Record<"dark" | "light", Record<FaceType, string>>;
  held: Record<"dark" | "light", Record<FaceType, string>>;
  finishLine: Record<FaceType | "squares", string>;
  shadow: string;
  input: Record<string, string>;
};

export type SquareColor = keyof typeof colors.squares;
