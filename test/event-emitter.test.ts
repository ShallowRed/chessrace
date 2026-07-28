import { describe, expect, it, vi } from "vitest";

import events from "app/game-events/event-emitter";

describe("the event bus", () => {

  it("calls every listener of a message", () => {
    events.reset();

    const first = vi.fn();
    const second = vi.fn();

    events.on("GAME_ON", first);
    events.on("GAME_ON", second);
    events.emit("GAME_ON");

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it("passes the payload through", () => {
    events.reset();

    const listener = vi.fn();

    events.on("MOVE_PLAYER", listener);
    events.emit("MOVE_PLAYER", [3, 4]);

    expect(listener).toHaveBeenCalledWith([3, 4]);
  });

  it("answers an ask only when every listener agrees", () => {
    events.reset();
    events.on("IS_ALLOWED_MOVING", () => true);
    expect(events.ask("IS_ALLOWED_MOVING")).toBe(true);

    events.on("IS_ALLOWED_MOVING", () => false);
    expect(events.ask("IS_ALLOWED_MOVING")).toBe(false);
  });

  it("forgets every listener on reset, so a new game starts clean", () => {
    const stale = vi.fn();

    events.on("GAME_ON", stale);
    events.reset();
    events.emit("GAME_ON");

    expect(stale).not.toHaveBeenCalled();
  });
});
