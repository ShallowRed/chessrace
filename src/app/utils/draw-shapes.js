export const draw = {
    frontFace: (ctx) => ({ left, top, width, height }) => {
        ctx.fillRect(left, top, width, height);
    },
    rightFace: (ctx) => ({ left, top, height, thickness }) => {
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(left + thickness, top + thickness);
        ctx.lineTo(left + thickness, top + height + thickness);
        ctx.lineTo(left, top + height);
        ctx.closePath();
        ctx.fill();
    },
    bottomFace: (ctx) => ({ left, top, width, thickness }) => {
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(left + width, top);
        ctx.lineTo(left + width + thickness, top + thickness);
        ctx.lineTo(left + thickness, top + thickness);
        ctx.closePath();
        ctx.fill();
    }
};
