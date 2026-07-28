import { describe, expect, it, vi } from "vitest";

import Sound from "app/ui/sound";

import type { AudioEngine } from "app/ui/sound";

const fakeEngine = () => {

  const started: number[] = [];

  const param = () => ({
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn()
  });

  const engine = {
    started,
    currentTime: 0,
    destination: {} as AudioNode,
    state: "running",
    resume: vi.fn(() => Promise.resolve()),
    createOscillator: () => ({
      type: "sine",
      frequency: param(),
      connect: (node: unknown) => node,
      start: (at: number) => started.push(at),
      stop: vi.fn()
    }),
    createGain: () => ({
      gain: param(),
      connect: (node: unknown) => node
    })
  };

  return engine as unknown as AudioEngine & { started: number[]; resume: ReturnType<typeof vi.fn> };
};

describe("sound", () => {

  it("waits for the first cue before building an engine", () => {
    const createEngine = vi.fn(fakeEngine);

    const sound = new Sound(createEngine);

    expect(createEngine).not.toHaveBeenCalled();

    sound.play("move");

    expect(createEngine).toHaveBeenCalledOnce();
  });

  it("reuses the same engine", () => {
    const createEngine = vi.fn(fakeEngine);

    const sound = new Sound(createEngine);

    sound.play("move");
    sound.play("capture");

    expect(createEngine).toHaveBeenCalledOnce();
  });

  it("schedules one voice per tone of the cue", () => {
    const engine = fakeEngine();

    const sound = new Sound(() => engine);

    sound.play("move");

    expect(engine.started).toHaveLength(1);

    sound.play("win");

    expect(engine.started).toHaveLength(5);
  });

  it("spreads the winning arpeggio over time", () => {
    const engine = fakeEngine();

    new Sound(() => engine).play("win");

    expect(engine.started).toEqual([0, 0.09, 0.18, 0.27]);
  });

  it("builds nothing at all while muted", () => {
    const createEngine = vi.fn(fakeEngine);

    const sound = new Sound(createEngine, true);

    sound.play("move");

    expect(createEngine).not.toHaveBeenCalled();
    expect(sound.isMuted).toBe(true);
  });

  it("comes back when unmuted", () => {
    const createEngine = vi.fn(fakeEngine);

    const sound = new Sound(createEngine, true);

    expect(sound.toggle()).toBe(false);

    sound.play("move");

    expect(createEngine).toHaveBeenCalledOnce();
  });

  it("wakes a suspended engine", () => {
    const engine = fakeEngine();

    Object.assign(engine, { state: "suspended" });

    new Sound(() => engine).play("move");

    expect(engine.resume.mock.calls).toHaveLength(1);
  });
});
