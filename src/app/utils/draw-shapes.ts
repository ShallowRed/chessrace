import type { FaceType } from "app/types";

interface FrontFace {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface RightFace {
  left: number;
  top: number;
  height: number;
  thickness: number;
}

interface BottomFace {
  left: number;
  top: number;
  width: number;
  thickness: number;
}

export const draw: {
  frontFace: (ctx: CanvasRenderingContext2D) => (face: FrontFace) => void;
  rightFace: (ctx: CanvasRenderingContext2D) => (face: RightFace) => void;
  bottomFace: (ctx: CanvasRenderingContext2D) => (face: BottomFace) => void;
} = {

  frontFace: ctx => ({ left, top, width, height }) => {

    ctx.fillRect(left, top, width, height);
  },

  rightFace: ctx => ({ left, top, height, thickness }) => {

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + thickness, top + thickness);
    ctx.lineTo(left + thickness, top + height + thickness);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.fill();
  },

  bottomFace: ctx => ({ left, top, width, thickness }) => {

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width + thickness, top + thickness);
    ctx.lineTo(left + thickness, top + thickness);
    ctx.closePath();
    ctx.fill();
  }
}

export type FaceDrawer = (face: FrontFace & RightFace & BottomFace) => void;

export function drawerFor(
  type: FaceType,
  ctx: CanvasRenderingContext2D
): FaceDrawer {

  return draw[type](ctx);
}
