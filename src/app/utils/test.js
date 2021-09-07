export function test(callback, n) {
  const start = Date.now();
  for (var i = 0; i < n; i++) {
    callback();
  }
  console.log(`${Date.now() - start}ms`);
}
