export function arrayIncludesArray(parentArray) {

  const parentArrayString = parentArray
    .map(child => child.join('_'));

  return childArray =>
    parentArrayString.includes(childArray.join('_'));
}
