import type { KeyValueStore } from 'app/storage';

const KEY = "chessrace.muted";

export function loadMuted(store: KeyValueStore): boolean {

  return store.getItem(KEY) === "true";
}

export function saveMuted(store: KeyValueStore, muted: boolean): void {

  store.setItem(KEY, `${muted}`);
}
