# Mechanics: what to try before narrowing

A divergence pass. Nothing here is decided and nothing here is built. The point
is to lay out the space, price each idea in what it costs to build **and in
what it costs the tooling**, and then pick a slate deliberately.

## Where we actually are

Measured, not guessed:

| | what the report says |
|---|---|
| worst survivable mistake | **2 moves**, on every level in the catalogue except three |
| worst mistake overall | 99 (unwinnable) or 2 — almost nothing in between |
| routes | 1 on a third of the levels: a rail, not a decision |

The flatness has one shape: **a wrong move costs either nothing worth counting
or the whole run.** There is no middle, and the middle is where hesitation
lives.

Two structural reasons for that, both worth attacking:

1. **The player has no state to lose but their life.** No health, no resource,
   no position worth defending. So every consequence collapses to 0 or ∞.
2. **Par is counted in moves, and the board charges in rows.** A sideways move
   costs nothing in par and a full row of margin in play. The metric cannot see
   the game's own currency.

## A bug first, because it changes what pawns are worth

`isValidTake` for a pawn is `y2 === y1 + 1`: diagonally **upward**. The threat
map calls the same function for enemies, so an enemy pawn holds the two squares
*behind* it, away from the player climbing towards it.

```
    · · × · × · · ·      ← what the enemy pawn holds today
    · · ○ P · · · ·      ← the player walks straight past it
```

The rule wants a side, not a piece: **forward is up for the player and down for
the enemy.** Fixing it makes the pawn the cheapest useful threat in the game —
it holds exactly the two squares a climber wants — and every pawn in the
catalogue starts doing something. It also changes what `bait`, `ladder`, `Small
change` and `Toll` mean, so it is a re-measure, not a one-line fix.

## The constraint that decides most of this

The solver is not a nicety. It proves every shipped level winnable, sets par,
counts routes, prices regret, drives the personas, and is the fitness the tuner
searches on. Its state today is `(column, row, piece, captured)` — small,
static, exhaustively searchable.

Every mechanic below is priced against that:

| mechanic | what it adds to the state | verdict |
|---|---|---|
| walls, one-way ledges, promotion tiles | nothing | free |
| pawn direction, capture buys time | nothing (cost function only) | free |
| one-use ability | one bit | free |
| **a board clock** | `tick mod period` | cheap, and it unlocks a whole family |
| patrols, sweepers, timed terrain, check-with-grace | ride on the clock | cheap **once the clock exists** |
| enemies that wake | one bit each | cheap |
| squares that crumble as you leave | one bit per cracked square | affordable up to a dozen — see `architecture.md` |
| enemies that chase you | the pursuer's position | affordable for one, not for two |

*Corrected after measuring: the last two rows first read "fatal". They are not.
The solver's worst level today explores 673 states, so a handful of cracked
squares or a single pursuer is well within reach. `architecture.md` has the
numbers, and the wider point that the instrument should not be steering the
design in the first place.*

**Most of the interesting things share one engine change: a clock** — though
notably neither instant death nor cracked squares need it.

## The danger question

Today an enemy's line is a **wall**: you may not enter it and may not cross it.
That was the right first move — it is what makes a queen care about anything —
but it has three problems.

- **It removes the choice.** You cannot decide to take a risk. The board simply
  refuses the click, so danger is pathfinding, not tension.
- **It forces the markers.** A rule you cannot see is a trap, so every held
  square must be painted. On a busy level that is a third of the board in red.
- **It cannot be turned off.** Hiding the markers would mean clicks that
  silently do nothing.

Three alternatives, in increasing order of how much I like them:

### 1. Death on entry
Step on a watched square and you die, exactly like a hole. Cheap, no state,
and it restores choice. But it puts every mistake back at ∞, which is the flat
part of the current numbers. It also makes hiding the markers a memory test
rather than a reading test.

### 2. Capture with one move of grace — *check*
You may end a move on a watched square. If you are still there when the board
next ticks, you are taken. So danger becomes a **debt payable in tempo**: cross
the watched rank if you can get out in one, or spend two moves going round.

This is the one I would bet on:

- It gives the middle we are missing. A wrong step costs a move, not a run.
- It makes the markers **optional**: entering a watched square is legal, so
  playing with them off is a fair test of reading rather than a guessing game.
  That in turn lets the red leave the board, which it badly needs.
- It is chess. Standing in check is legal; staying there is not.
- It prices in tempo, which is the game's actual currency.

Cost: honest and non-trivial. The solver must gain the board clock, because
whether you survive depends on *when* you leave, not on how many moves you
took. Par stops being a move count.

### 3. Check, plus a way to answer it
Taking the piece that threatens you resolves the check. That already works, but
under grace it becomes a real tactic: walk into the line deliberately, take the
watcher next move, come out ahead. That is the first move in this game that
would feel clever.

## Terrain we do not have

The board has exactly two kinds of square: safe, and lethal. That is a thin
vocabulary, and both existing patterns for shaping a long-range piece
(`portcullis`, `crossfire`) have to spend an enemy to do it.

- **Walls / raised blocks.** Impassable, not lethal, and they cut lines. The
  missing primitive: a way to shape a queen's movement without killing her and
  without spending a piece. Free for the solver, and the pseudo-3D already
  draws cubes — a wall is a taller one. **Highest value per unit of work on
  this page.**
- **Walls are cover.** Holes already cut an enemy's line — that is the `shadow`
  pattern, and it is the most interesting thing in the vocabulary. Walls would
  give the same shelter without the square underneath being lethal, which means
  cover you can actually stand on.
- **One-way ledges.** A square you can enter only from below. No state, and it
  buys commitment: routes that cannot be walked back turn a cheap mistake into
  an expensive one, which is exactly the missing middle.
- **Promotion tiles.** A square that changes your form without a capture. Lets
  a level author the form arc directly instead of scattering enemies to do it.

## Enemies that are not statues

Every enemy is currently furniture. This is the largest untapped source of the
two things the catalogue has none of — rhythm and surprise — and once the clock
exists, most of it is cheap.

- **Sentry** — today's piece. Keep it; it is the readable baseline.
- **Patroller** — steps back and forth on a short beat. Periodic, so the solver
  only pays the period. The board acquires a pulse you can time.
- **Sweeper** — a rook sliding one square along its rank per tick. Its *line*
  moves, so a corridor opens and shuts. This is rhythm in its purest form and
  it is the one I would build first.
- **Waker** — dormant until you enter its range, then it holds its squares.
  Costs a bit per enemy and makes the first crossing of a level different from
  the second.
- **Hunter** — fixed to the screen rather than the board, so it climbs with
  you. Real pressure, but its position depends on your history, and that is the
  expensive column of the table above. Park it.

## The economy

- **A capture buys a beat.** Taking a piece holds the board still for one tick.
  Captures stop being only a form change and become a tempo resource, which is
  the decision the "Trade routes" world claims to be about and currently is
  not. Free to build, and it only makes sense once we price in rows.
- **One held leap.** A single move per level that ignores threat. One bit of
  state, and it is what makes hidden danger fair: you always have one answer.

## The metric has to change with the game

If we take the clock, **par should be counted in rows lost, not moves made**,
and regret with it. Reasons:

- It is what the board charges. A sideways move is free in par and costs a row
  in play; the metric currently cannot see the difference.
- I hit this already: on The gauntlet the BFS-shortest route was not the
  survivable one, and the fix was to move the spawn rather than to admit the
  metric was measuring the wrong thing.
- It may flatten the flatness on its own. "Every wrong move costs 2" is partly
  an artefact of counting moves; the same choices priced in rows spread out.

## What I would take into the next iteration

In order, and small enough to actually finish and judge:

1. **Sides have a forward direction.** Fixes the pawn, re-measures the
   catalogue. Free, and obviously right.
2. **Walls.** One new terrain symbol, no solver change, immediately widens what
   a level can say. Cheap enough to do alongside anything.
3. **The clock, and check with one move of grace.** The real change. Par and
   regret move to rows. Markers become a setting rather than a requirement.
4. **The sweeper.** The first moving enemy, riding the clock from 3.
5. **A capture buys a beat.** Only meaningful after 3.

Deliberately parked: crumbling squares and hunters (they cost us the solver),
fog (it fights the planning that is the game's pleasure), and any second
resource for the player beyond the one leap.

## How we would judge it, rather than argue about it

We have the instruments; they just need to be pointed at the question.

- Build the **same skeleton under two rulesets** and let the tuner search each.
  If check-with-grace is better, its best-of-N scores higher and the wrong
  moves cost something other than 2.
- Read the **regret distribution**, not its maximum. What we want is several
  decisions in the 3–8 band along one route, which is rhythm; a single 99 is
  not.
- Run the **personas**. The planner tells us a level is finishable at all; the
  spread between the planner and the climber tells us whether it has to be
  worked out on the way up.
- Watch the numbers we are *not* optimising. A ruleset that raises cost while
  collapsing routes to 1 has bought tension with a rail.

## Open questions

- Should the markers be a difficulty setting, a per-world property, or gone
  after the teaching world?
- Does the player keep the capture-as-transformation rule if promotion tiles
  exist, or do the two compete for the same job?
- Is the board's tempo a level property (it is today) or a thing the player
  pushes on — faster when you climb, slower when you take?
