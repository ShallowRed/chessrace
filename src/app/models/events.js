export default new class Events {


  constructor() {

    this.listeners = {};
  }


  listen = (message, listener) => {

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

      const validResults = results.filter(Boolean);

      if (results.length === validResults.length) {
        resolve(results);
      }
    });
  }
}();
