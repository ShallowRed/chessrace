export function test(key, callback, n = 1) {

  if (typeof key === "function") {

    n = 0 + callback;

    callback = key;

    key = "";

  } else key += " : ";

  const start = Date.now();

  for (var i = 0; i < n; i++) {
    
    callback();
  }

  console.log(`${key}${Date.now() - start}ms`, `/ ${n}`);
}
