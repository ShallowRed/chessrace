const { abs, sign, max, round, random } = Math;

export function getSquaresOnTrajectory([x, y], [tx, ty]) {

  const deltaLength = max(
    abs(tx - x),
    abs(ty - y)
  );

  const getSquareOnTrajectory = (e, i) => ([
    x + sign(tx - x) * (i + 1),
    y + sign(ty - y) * (i + 1)
  ]);

  return new Array(deltaLength - 1)
    .fill()
    .map(getSquareOnTrajectory)
}

export function translateY(element, { distance = 0, duration = 0 } = {}) {
  element.style.transitionDuration = `${duration}s`;
  element.style.transform = `translateY(${distance}px)`;
}

export function filterMap(array, { filter, map }) {

  return array.map((value, index) => {
      return filter({ value, index }) && ({ value, index });
    })
    .filter(({ index }) => typeof index === "number")
    .map(map)
}

export function getRandomPiecesColor() {

  const colors = ["white", "black"];

  const randomBool = round(random());

  return [colors[randomBool], colors[1 - randomBool]]
}

export function getBoundMethods(obj, callback, depthKeys = []) {

  for (const key in obj) {

    if (typeof obj[key] === "function") {

      callback(key, obj[key].bind(this), depthKeys);

    } else if (typeof obj[key] === "object") {

      getBoundMethods.call(this, obj[key], callback, [...depthKeys, key])
    }
  }
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
