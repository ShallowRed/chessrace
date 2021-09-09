import GameObject from 'app/components/Game-object';

export function get() {

  const { columns, rows } = this;
  const { size, depth, offset } = GameObject;

  const playableZone = {
    width: columns * size,
    height: rows * size,
  }

  return {

    playableZone,

    container: {
      width: playableZone.width + depth + offset.shadow,
      height: playableZone.height + size + depth,
      top: depth
    },

    canvas: {
      frontFace: {
        width: playableZone.width,
        height: playableZone.height + size
      },
      shadows: {
        width: playableZone.width,
        height: playableZone.height + size + depth + offset.shadow,
        left: depth + offset.shadow,
      },
      rightFaces: {
        width: playableZone.width - size + depth,
        height: playableZone.height + size + depth,
        left: size,
      },
      bottomFaces: {
        width: playableZone.width + depth,
        height: playableZone.height + size + depth,
      },
      lowestBottomFace: {
        width: playableZone.width + depth,
        height: depth,
        bottom: size,
      }
    }
  };
}

export function set() {

  const dimensions = this.dimensions.get();

  for (const [key, value] of Object.entries(dimensions.container)) {
    GameObject.container.style[key] = `${value}px`;
  }

  for (const name in this.canvas) {

    this.dimensions.setCanvas(
      dimensions.playableZone,
      this.canvas[name],
      dimensions.canvas[name],
    );
  }

  this.ctx.shadows.fillStyle = this.colors.shadow;
}

export function setCanvas(playableZone, canvas, {
  height,
  width,
  bottom = 0,
  left = 0,
} = {}) {

  const { size, depth } = GameObject;

  canvas.setStyle({ width, height, bottom });

  canvas.container?.setStyle({
    width: canvas.width,
    height: canvas.height,
    bottom: playableZone.height - height + size * 2 + depth,
    left
  });
}
