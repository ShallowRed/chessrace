interface ElementOptions {
  className?: string;
  text?: string;
  onClick?: () => void;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  { className, text, onClick }: ElementOptions = {},
  children: HTMLElement[] = []
): HTMLElementTagNameMap[K] {

  const element = document.createElement(tag);

  if (className) element.className = className;

  if (text !== undefined) element.textContent = text;

  if (onClick) element.addEventListener("click", onClick);

  element.append(...children);

  return element;
}

export function show(element: HTMLElement): void {

  element.hidden = false;
}

export function hide(element: HTMLElement): void {

  element.hidden = true;
}

export function stars(rating: number): string {

  return "★★★".slice(0, rating) + "☆☆☆".slice(0, 3 - rating);
}
