export function filterMap(array, { filter, map }) {

  const getFilteredValuesAndIndex = (value, index) =>
    filter({ value, index }) && ({ value, index })

  const isValidIndex = ({ index }) =>
    typeof index === "number"

  return array.map(getFilteredValuesAndIndex)
    .filter(isValidIndex)
    .map(map)
}
