import PlayArea from 'app/game-objects/board/models/play-area';

import { draw } from "app/utils/draw-shapes";

export function render() {

  const { width, thickness, input, offset } = PlayArea;

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
    // height: top - input.edgeToHole.thickness
  });

  // front face in hole
  ctx.down.fillStyle = color.xDark;
  draw.frontFace(ctx.down)({
    left: offset.left + thickness,
    top: input.height + input.edgeToHole.thickness,
    width: width,
    height: thickness
  });

  // Block right face
  ctx.top.fillStyle = color.medium;
  draw.rightFace(ctx.top)({
    left: input.width,
    top: 0,
    height: input.height,
    thickness: input.thickness
  });

  // Right face in hole
  ctx.down.fillStyle = color.xxDark;
  draw.rightFace(ctx.down)({
    left: offset.left,
    top: input.height + input.edgeToHole.thickness - thickness,
    height: thickness,
    thickness: thickness
  });

  // Top large bottom face
  ctx.top.fillStyle = color.dark;
  draw.bottomFace(ctx.top)({
    left: input.edgeToHole.width - 1,
    top: input.height,
    width: width + 2,
    thickness: input.edgeToHole.thickness
  });

  // Bottom large bottom face
  ctx.down.fillStyle = color.dark;
  draw.bottomFace(ctx.down)({
    left: offset.left + thickness - 1,
    top: input.height + thickness + input.edgeToHole.thickness,
    width: width + 2,
    thickness: input.edgeToHole.thickness
  });

  // Left bottom face
  draw.bottomFace(ctx.down)({
    left: 0,
    top: input.height,
    width: input.edgeToHole.width,
    thickness: input.thickness
  });

  // Right bottom face
  draw.bottomFace(ctx.top)({
    left: width + input.edgeToHole.width,
    top: input.height,
    width: input.edgeToHole.width,
    thickness: input.thickness
  });
  // 
  // drawText(ctx.top, input);
}

function drawText(ctx, input) {

  const text = "Chess Race";

  const w = input.width - 6;
  const h = Math.ceil(input.height / 2);

  const offset = 500;


  const fontSize =

    Math.min(
      30,
      Math.max(
        Math.round(input.height / 2),
        Math.round(input.width / 20)
      )
    );

    console.log(fontSize);

  const shift = Math.round(fontSize / 10);;
  const blur = Math.round(fontSize / 5);

  ctx.font = `800 ${fontSize}px sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "black";
  ctx.fillText(text, w, h);

  ctx.globalCompositeOperation = "destination-over";
  ctx.shadowColor = "white";
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offset * 2 + shift;
  ctx.shadowOffsetY = offset * 2 + shift;
  ctx.fillText(text, w - offset, h - offset);

  ctx.globalCompositeOperation = "xor";
  ctx.fillStyle = "#29292b";
  ctx.shadowColor = "transparent";
  ctx.fillText(text, w, h);

  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "#909199";
  ctx.fillText(text, w, h);

  ctx.globalCompositeOperation = "source-over";
}
