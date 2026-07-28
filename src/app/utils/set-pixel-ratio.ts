type BackingStoreContext = CanvasRenderingContext2D & {
  webkitBackingStorePixelRatio?: number;
  mozBackingStorePixelRatio?: number;
  msBackingStorePixelRatio?: number;
  oBackingStorePixelRatio?: number;
  backingStorePixelRatio?: number;
};

export const PIXEL_RATIO = (() => {

  const ctx: BackingStoreContext | null = document.createElement("canvas")
    .getContext("2d");

  const dpr = window.devicePixelRatio || 1;

  const bsr = ctx && (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio
  ) || 1;

  return dpr / bsr;

})();
