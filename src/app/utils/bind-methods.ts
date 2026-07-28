type ReflectedMethod = (...args: never[]) => unknown;

type Namespace = Record<string, unknown>;

type BindCallback = (
  methodName: string,
  boundMethod: ReflectedMethod,
  depthKeys: string[]
) => void;

export function getBoundMethods(
  this: unknown,
  obj: Namespace,
  callback: BindCallback,
  depthKeys: string[] = []
): void {

  for (const key in obj) {

    const value = obj[key];

    if (typeof value === "function") {

      callback(key, (value as ReflectedMethod).bind(this), depthKeys);

    } else if (typeof value === "object" && value !== null) {

      getBoundMethods.call(this, value as Namespace, callback, [...depthKeys, key])
    }
  }
}

export function bindObjectsMethods(
  this: Namespace,
  objects: Record<string, Namespace>
): void {

  for (const key in objects) {

    bindObjectMethods.call(this, objects[key] as Namespace, key);
  }
}

export function bindObjectMethods(
  this: Namespace,
  obj: Namespace,
  key: string
): void {

  if (!this[key]) {

    this[key] = {};
  }

  const bindDeepestObject: BindCallback = (methodName, boundMethod, depthKeys) => {

    const deepestObj = getDeepestObj(this[key] as Namespace, depthKeys);

    deepestObj[methodName] = boundMethod;
  }

  getBoundMethods.call(this, obj, bindDeepestObject);
}

function getDeepestObj(obj: Namespace, keys: string[]): Namespace {

  keys.forEach(key => {

    if (!obj[key]) {
      obj[key] = {};
    }

    obj = obj[key] as Namespace;
  });

  return obj;
}
