export function getBoundMethods(obj, callback, depthKeys = []) {

  for (const key in obj) {

    if (typeof obj[key] === "function") {

      callback(key, obj[key].bind(this), depthKeys);

    } else if (typeof obj[key] === "object") {

      getBoundMethods.call(this, obj[key], callback, [...depthKeys, key])
    }
  }
}

export function getEachBoundMethods(objects, callback) {

  objects.forEach(obj => {

    getBoundMethods.call(this, obj, callback);
  });
}

export function bindObjectsMethods(objects) {

  for (const key in objects) {

    bindObjectMethods.call(this, objects[key], key);
  }
}

export function bindObjectMethods(obj, key) {

  this[key] = {};

  const bindDeepestObject = (methodName, boundMethod, depthKeys) => {

    let deepestObj = getDeepestObj(this[key], depthKeys);

    deepestObj[methodName] = boundMethod;
  }

  getBoundMethods.call(this, obj, bindDeepestObject);
}

function getDeepestObj(obj, keys) {

  keys.forEach(key => {

    if (!obj[key]) {
      obj[key] = {};
    }

    obj = obj[key];
  });

  return obj;
}
