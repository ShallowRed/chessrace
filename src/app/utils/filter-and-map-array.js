export function filterMap(array, { filter, map }) {

  const valuesAndIndexMatchingFilter = (value, index) =>
    filter({ value, index }) && ({ value, index });

  return array.map(valuesAndIndexMatchingFilter)
    .filter(Boolean)
    .map(map)
}
