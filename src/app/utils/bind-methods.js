export function getBoundMethods(obj, callback, depthKeys = []) {
    for (const key in obj) {
        const value = obj[key];
        if (value instanceof Function) {
            callback(key, value.bind(this), depthKeys);
        }
        else if (value instanceof Object) {
            getBoundMethods.call(this, value, callback, [...depthKeys, key]);
        }
    }
}
export function bindObjectsMethods(objects) {
    for (const key in objects) {
        bindObjectMethods.call(this, objects[key], key);
    }
}
export function bindObjectMethods(obj, key) {
    if (!this[key]) {
        this[key] = {};
    }
    const bindDeepestObject = (methodName, boundMethod, depthKeys) => {
        let deepestObj = getDeepestObj(this[key], depthKeys);
        deepestObj[methodName] = boundMethod;
    };
    getBoundMethods.call(this, obj, bindDeepestObject);
}
function getDeepestObj(obj, keys) {
    keys.forEach((key) => {
        let childObj = obj?.[key];
        if (!childObj) {
            childObj = {};
        }
        obj = childObj;
    });
    return obj;
}
