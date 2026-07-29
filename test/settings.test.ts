import { describe, expect, it } from "vitest";

import { devAsked, loadDev, saveDev } from "app/settings";

import type { KeyValueStore } from "app/storage";

const fakeStorage = (): KeyValueStore => {

  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, value)
  };
};

describe("the dev switch", () => {

  it("says nothing when the query does not mention it", () => {
    expect(devAsked("")).toBeUndefined();
    expect(devAsked("?level=climb")).toBeUndefined();
  });

  it("reads any bare mention as on", () => {
    expect(devAsked("?dev")).toBe(true);
    expect(devAsked("?dev=1")).toBe(true);
    expect(devAsked("?level=climb&dev=yes")).toBe(true);
  });

  it("reads the ways of saying no", () => {
    expect(devAsked("?dev=off")).toBe(false);
    expect(devAsked("?dev=false")).toBe(false);
    expect(devAsked("?dev=0")).toBe(false);
  });

  it("stays off until it is stored, and sticks once it is", () => {
    const storage = fakeStorage();

    expect(loadDev(storage)).toBe(false);

    saveDev(storage, true);

    expect(loadDev(storage)).toBe(true);

    saveDev(storage, false);

    expect(loadDev(storage)).toBe(false);
  });
});
