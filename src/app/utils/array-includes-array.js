export function arrayIncludesArray(parentArray) {

  const parentArrayString = parentArray
    .map(child => child.join(''));

  return childArray =>
    parentArrayString.includes(childArray.join(''));
}
