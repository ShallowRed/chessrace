export function test(key, callback, n) {

  const start = Date.now();

  for (var i = 0; i < n; i++) {
    callback();
  }

  console.log(`${key} : ${Date.now() - start}ms`);
}
