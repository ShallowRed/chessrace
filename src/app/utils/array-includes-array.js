export function arrayIncludesArray(parentArray) {
    const parentArrayString = parentArray
        .map(childArray => childArray.join('_'));
    return (childArray) => parentArrayString.includes(childArray.join('_'));
}
