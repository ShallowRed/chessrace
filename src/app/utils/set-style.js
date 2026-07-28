export function setStyle({ element, styles }) {

  for (const [key, value] of Object.entries(styles)) {

    if (element[key]) {

      this[key] = element[key] = value;

    } else {

      element.style[key] = `${value}px`;
    }
  }
}
