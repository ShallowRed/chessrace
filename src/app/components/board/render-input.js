import PlayArea from 'app/models/play-area';

import { draw } from "app/utils/draw-shapes";

export function render() {

  const { width, input, offset: { left, thickness } } = PlayArea;

  const ctx = {
    top: this.ctx.inputTop,
    down: this.ctx.inputBottom
  }

  const color = {
    light: "#babbc5",
    medium: "#909199",
    dark: "#67686d",
    xDark: "#3e3e41",
    xxDark: "#29292b"
  }

  // Block front face
  ctx.top.fillStyle = color.light;
  draw.frontFace(ctx.top)({
    left: 0,
    top: 0,
    width: input.width,
    height: input.height
    // height: top - input.thickness.height
  });

  // front face in hole
  ctx.down.fillStyle = color.xDark;
  draw.frontFace(ctx.down)({
    left: left + thickness,
    top: input.height + input.thickness.height,
    width: width,
    height: thickness
  });

  // Block right face
  ctx.top.fillStyle = color.medium;
  draw.rightFace(ctx.top)({
    left: input.width,
    top: 0,
    height: input.height,
    thickness: input.thickness.full
  });

  // Right face in hole
  ctx.down.fillStyle = color.xxDark;
  draw.rightFace(ctx.down)({
    left: left,
    top: input.height + input.thickness.height - thickness,
    height: thickness,
    thickness: thickness
  });

  // Top large bottom face
  ctx.top.fillStyle = color.dark;
  draw.bottomFace(ctx.top)({
    left: input.thickness.width - 1,
    top: input.height,
    width: width + 2,
    thickness: input.thickness.height
  });

  // Bottom large bottom face
  ctx.down.fillStyle = color.dark;
  draw.bottomFace(ctx.down)({
    left: left + thickness - 1,
    top: input.height + thickness + input.thickness.height,
    width: width + 2,
    thickness: input.thickness.height
  });

  // Left bottom face
  draw.bottomFace(ctx.down)({
    left: 0,
    top: input.height,
    width: input.thickness.width,
    thickness: input.thickness.full
  });

  // Right bottom face
  draw.bottomFace(ctx.top)({
    left: width + input.thickness.width,
    top: input.height,
    width: input.thickness.width,
    thickness: input.thickness.full
  });

}
