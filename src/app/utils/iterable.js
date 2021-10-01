export default class Iterable {

  constructor(getArray) {

    return {

      [Symbol.iterator]: function(i = 0) {

        const array = getArray();

        return {
          next: () => ({
            done: i === array.length,
            value: array[i++]
          })
        }
      }
    }
  }
}
