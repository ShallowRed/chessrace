import type { KeyValueStore } from 'app/storage';

const MUTED = "chessrace.muted";

const DEV = "chessrace.dev";

export function loadMuted(store: KeyValueStore): boolean {

  return store.getItem(MUTED) === "true";
}

export function saveMuted(store: KeyValueStore, muted: boolean): void {

  store.setItem(MUTED, `${muted}`);
}

export function loadDev(store: KeyValueStore): boolean {

  return store.getItem(DEV) === "true";
}

export function saveDev(store: KeyValueStore, dev: boolean): void {

  store.setItem(DEV, `${dev}`);
}

// ?dev turns it on and ?dev=off turns it back off, and it sticks either way:
// the query is a switch, not a mode you have to keep in the address bar.
export function devAsked(search: string): boolean | undefined {

  const value = new URLSearchParams(search).get("dev");

  if (value === null) return undefined;

  return value !== "off" && value !== "false" && value !== "0";
}
