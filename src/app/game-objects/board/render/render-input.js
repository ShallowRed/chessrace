import PlayArea from 'app/game-objects/board/models/play-area';

import { draw } from "app/utils/draw-shapes";

export function render() {

  const { width, thickness, input, offset } = PlayArea;

  const ctx = {
    front: this.ctx.inputFront,
    rear: this.ctx.inputRear
  }

  const colors = this.colors.input;

  // Block front face
  ctx.front.fillStyle = colors.light;
  draw.frontFace(ctx.front)({
    left: 0,
    top: 0,
    width: input.width,
    height: input.height
  });

  // front face in hole
  ctx.rear.fillStyle = colors.xDark;
  draw.frontFace(ctx.rear)({
    left: offset.left + thickness,
    top: input.height + input.edgeToHole.thickness,
    width: width,
    height: thickness
  });

  // Block right face
  ctx.front.fillStyle = colors.medium;
  draw.rightFace(ctx.front)({
    left: input.width,
    top: 0,
    height: input.height,
    thickness: input.thickness
  });

  // Right face in hole
  ctx.rear.fillStyle = colors.xxDark;
  draw.rightFace(ctx.rear)({
    left: offset.left,
    top: input.height + input.edgeToHole.thickness - thickness,
    height: thickness,
    thickness: thickness
  });

  // Top large bottom face
  ctx.front.fillStyle = colors.dark;
  draw.bottomFace(ctx.front)({
    left: input.edgeToHole.width - 1,
    top: input.height,
    width: width + 2,
    thickness: input.edgeToHole.thickness
  });

  // Bottom large bottom face
  ctx.rear.fillStyle = colors.dark;
  draw.bottomFace(ctx.rear)({
    left: offset.left + thickness - 1,
    top: input.height + thickness + input.edgeToHole.thickness,
    width: width + 2,
    thickness: input.edgeToHole.thickness
  });

  // Left bottom face
  draw.bottomFace(ctx.rear)({
    left: 0,
    top: input.height,
    width: input.edgeToHole.width,
    thickness: input.thickness
  });

  // Right bottom face
  draw.bottomFace(ctx.front)({
    left: width + input.edgeToHole.width,
    top: input.height,
    width: input.edgeToHole.width,
    thickness: input.thickness
  });
}
