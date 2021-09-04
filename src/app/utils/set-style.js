export function setStyle(config, value, element) {

  if (typeof config === "object") {

    for (const key in config) {

      this.setStyle(key, config[key], element);
    }

  } else if (element[config]) {

    this[config] = element[config] = value;

  } else {

    element.style[config] = `${value}px`;
  }
}
