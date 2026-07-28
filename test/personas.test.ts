import { describe, expect, it } from "vitest";

import { blueprintOf, levelBySlug, levels } from "app/level/catalogue";
import { levelConfig } from "app/level/config";
import { PERSONAS, playthrough, playthroughs } from "app/level/personas";
import { parseLevelGrid } from "app/level/notation";
import { parseBlueprint } from "app/utils/parse-blueprint";

import type { Persona } from "app/level/personas";
import type { Durations } from "app/types";

const named = (name: string) =>
  PERSONAS.find(persona => persona.name === name) as Persona;

const runLevel = (slug: string) => {
  const level = levelBySlug(slug);

  return playthroughs(
    blueprintOf(level),
    level.columns,
    level.spawn,
    levelConfig(level).durations
  );
};

const outcomeOf = (runs: ReturnType<typeof runLevel>, persona: string) =>
  runs.find(run => run.persona === persona)?.outcome;

describe("personas", () => {

  const steady: Durations =
    { move: 0.3, scroll: 2, fall: 1, speedUp: 1, minScroll: 0.9 };

  const onGrid = (grid: string, persona: Persona) => {
    const columns = (grid.trim().split("\n")[0] ?? "").trim().length;

    return playthrough(
      parseBlueprint(parseLevelGrid(grid), columns),
      columns,
      { position: [1, 0], pieceName: "queen" },
      steady,
      persona
    );
  };

  it("gets a climber up an open board", () => {
    expect(onGrid("...\n...\n...", named("climber")).outcome).toBe("won");
  });

  it("reports being caught when the board outruns the player", () => {
    const tall = Array.from({ length: 20 }, () => "._.").join("\n");

    expect(onGrid(tall, named("dawdler")).outcome).toBe("caught");
  });

  it("reports being stuck when nothing is legal any more", () => {
    // walled in on every side, with nowhere legal even sideways
    expect(onGrid("___\n___\n_._", named("climber")).outcome).toBe("stuck");
  });

  it("never lets a greedy climber ping-pong on the spot", () => {
    const run = onGrid("...\n._.\n...", named("climber"));

    expect(run.outcome).toBe("won");
    expect(run.moves).toBeLessThanOrEqual(4);
  });
});

describe("what the personas say about the catalogue", () => {

  // The bait levels are built so that taking the tempting piece is a dead end.
  // The magpie is the player who always takes, and it walks into both.
  it("strands the magpie on the levels built to bait it", () => {
    expect(outcomeOf(runLevel("bad-trade"), "magpie")).toBe("stuck");
    expect(outcomeOf(runLevel("the-wrong-queen"), "magpie")).toBe("stuck");
  });

  // The line that matters: a player who knows the route must be able to walk
  // it at a human pace. Climb and Bad trade used to fail this, their shortest
  // route opening with a sideways move that the board punished.
  it("lets a player who knows the route finish every level in time", () => {
    for (const level of levels) {
      expect(outcomeOf(runLevel(level.slug), "planner")).toBe("won");
    }
  });

  it("lets a steady player through the opening world", () => {
    for (const slug of ["climb", "take-to-become", "leap", "blocked-line"]) {
      expect(outcomeOf(runLevel(slug), "climber")).toBe("won");
    }
  });
});
