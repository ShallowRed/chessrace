import type { Coords } from "app/types";

export function arrayIncludesArray(
  parentArray: readonly Coords[]
): (childArray: readonly number[]) => boolean {

  const keys = new Set(parentArray
    .map(child => child.join('_')));

  return childArray =>
    keys.has(childArray.join('_'));
}
