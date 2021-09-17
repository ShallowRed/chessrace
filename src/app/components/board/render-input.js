import GameObject from 'app/components/Game-object';

import { draw } from "app/utils/draw-shapes";

export function render() {

  const { playArea, depth, shadowOffset, size } = GameObject;

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

  ctx.top.fillStyle = color.light;
  draw.frontFace(ctx.top)({
    left: 0,
    top: 0,
    width: playArea.width + depth * 4,
    height: size - depth
  });

  ctx.down.fillStyle = color.xDark;
  draw.frontFace(ctx.down)({
    left: depth * 4,
    top: size,
    width: playArea.width + depth * 4,
    height: depth
  });

  ctx.top.fillStyle = color.medium;
  draw.rightFace(ctx.top)({
    left: playArea.width + depth * 4,
    top: -depth * 5,
    height: size + depth * 4,
    depth: depth * 3
  });

  ctx.down.fillStyle = color.xxDark;
  draw.rightFace(ctx.down)({
    left: depth * 3,
    top: size - depth,
    height: depth,
    depth: depth
  });

  ctx.top.fillStyle = color.dark;
  draw.bottomFace(ctx.top)({
    left: 0,
    top: size - depth,
    width: playArea.width + depth * 4,
    depth: depth
  });

  ctx.down.fillStyle = color.dark;
  draw.bottomFace(ctx.down)({
    left: depth * 2,
    top: size + depth,
    width: playArea.width + depth * 2,
    depth: depth
  });

  draw.bottomFace(ctx.down)({
    left: depth,
    top: size ,
    width: depth * 2,
    depth: depth
  });

  draw.bottomFace(ctx.top)({
    left: playArea.width + depth * 3,
    top: size ,
    width: depth * 2,
    depth: depth * 2
  });

}
