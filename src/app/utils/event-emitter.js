export default new class EventEmitter {

  constructor() {
    this.listeners = {};
  }

  on = (message, listener) => {

    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }

    this.listeners[message].push(listener);
  }

  emit(message, ...args) {

    const messages = this.listeners[message];

    const results = [];

    if (messages) {
      messages.forEach(listener => {

        results.push(listener(...args));
      });
    }

    return new Promise(function(resolve) {

      if (
        results.length === results.filter(Boolean)
        .length
      ) {
        resolve(results);
      }
    });
  }
}();
