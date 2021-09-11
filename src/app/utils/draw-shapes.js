export const draw = {

  frontFace: ctx => ({ left, top, width, height }) => {

    ctx.fillRect(left, top, width, height);
  },

  rightFace: ctx => ({ left, top, height, depth }) => {

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + depth, top + depth);
    ctx.lineTo(left + depth, top + height + depth);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.fill();
  },

  bottomFace: ctx => ({ left, top, width, depth }) => {
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width + depth, top + depth);
    ctx.lineTo(left + depth, top + depth);
    ctx.closePath();
    ctx.fill();
  }
}
