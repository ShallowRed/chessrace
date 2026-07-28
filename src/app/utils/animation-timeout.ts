export function animationTimeout(
  callback: () => void,
  delay: number,
  start = Date.now()
): void {

  const delta = (Date.now() - start) / 1000;

  if (delta >= delay) {
    callback();
    return;
  }

  window.requestAnimationFrame(() =>
    animationTimeout(callback, delay, start)
  );
}
