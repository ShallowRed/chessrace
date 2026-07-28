export type StyleValues = Record<string, number>;

export function setStyle(
  this: Record<string, unknown> | undefined,
  { element, styles }: { element: HTMLElement; styles: StyleValues }
): void {

  const properties = element as unknown as Record<string, unknown>;

  for (const [key, value] of Object.entries(styles)) {

    if (properties[key]) {

      properties[key] = value;

      if (this) this[key] = value;

    } else {

      element.style.setProperty(key, `${value}px`);
    }
  }
}
