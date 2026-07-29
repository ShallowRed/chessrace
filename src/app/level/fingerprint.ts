import type { Level } from 'app/level/catalogue';

// What makes a level the level it is, for the purpose of "have I played this?".
// Renaming it changes nothing a player has to relearn; moving one hole does.
export function fingerprint({ blueprint, spawn, speedUp }: Level): string {

  const shape = [
    blueprint,
    spawn.pieceName,
    spawn.position.join(","),
    speedUp ?? ""
  ].join("|");

  let hash = 5381;

  for (let index = 0; index < shape.length; index++) {

    hash = (hash * 33) ^ shape.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}
