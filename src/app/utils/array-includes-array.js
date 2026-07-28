export function arrayIncludesArray(parentArray) {

  const keys = new Set(parentArray
    .map(child => child.join('_')));

  return childArray =>
    keys.has(childArray.join('_'));
}
