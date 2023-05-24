import { animationTimeout } from 'app/utils/animation-timeout';

export default new class Events {

  constructor() {
    this.on = (message, listener) => {
      if (!this.listeners[message]) {
        this.listeners[message] = [];
      }
      this.listeners[message].push(listener);
    };
    this.listeners = {};
  }

  emit(message, ...args) {
    const messages = this.listeners[message];
    if (messages?.length) {
      messages.forEach((listener) => {
        listener(...args);
      });
    }
  }

  get(message, ...args) {
    const messages = this.listeners[message];
    if (messages?.length) {
      return messages.map((listener) => listener(...args));
    }
  }

  ask(message, ...args) {
    const results = this.get(message, ...args);
    const validResults = results?.filter(Boolean);
    return results &&
      validResults &&
      results.length === validResults.length;
  }

  timeout(message, delay, ...args) {
    animationTimeout(() => {
      return this.emit(message, ...args);
    }, delay);
  }
}();
