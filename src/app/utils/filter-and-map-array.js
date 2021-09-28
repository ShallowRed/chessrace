export default class FilterMap {

  constructor(array) {

    this.array = array;
  }

  filter(callback) {

    this.filteredArray = this.array.map((value, index) => {

        if (callback(value, index)) {

          return ({ value, index });
        }
      })
      .filter(Boolean);

    return this;
  }

  map(callback) {

    return this.filteredArray.map(({ value, index }) => {

      return callback(value, index);
    })
  }
}
