# Making the code welcome a new mechanic

Written to answer one question: what has to change so that trying a mechanic is
a day's work and not a refactor. It also corrects a claim I made in
`mechanics.md` that the numbers do not support.

## The correction first

I called squares that crumble behind you *fatal* for the solver, on the grounds
that the crumbled set is the path and therefore does not compress. That is true
of a board where **every** square crumbles. It is not true of a board with a
handful of cracked ones, which is the only way anyone would use them.

The solver's real state space, measured over the shipped catalogue:

```
worst level (The long way)           673 states
a cracked set of k squares  ×2^k:
  k=4       10,768        k=8      172,288
  k=6       43,072        k=10     689,152
```

Eight cracked squares fits under the limit the solver already runs with. Twelve
is under three million, which is a BFS over small integers — milliseconds. The
mechanic is affordable; my reasoning was about the wrong version of it.

The same correction applies, smaller, to a chasing enemy: **one** pursuer costs
`673 × 160 ≈ 108k` and is affordable. Two are not. So the honest line is not
"no pursuers", it is "one".

And a point in favour of both of your choices: **instant death and cracked
squares need no clock.** Both are pure functions of where you are and where you
have been. The clock was a cost of *my* proposal, not of yours.

## The instrument should not be steering

I have been letting what the solver can measure decide what the game is
allowed to be, and that is backwards. The solver's job is to stop us shipping a
level nobody can finish, and to tell us things we would otherwise argue about.
It is not a design authority.

Where instant death does break the metric, the metric is what should move:
`tension` only ever looks at *legal* moves, so it cannot see a mistake that
kills — it already cannot see a hole. With watched squares becoming lethal it
will be blind to most of the danger on the board. What it needs is a measure of
**exposure**: how many of the moves available at each step are fatal, and how
much of the route runs next to something that kills. That is the thing a player
actually feels, and today nothing counts it.

## The one seam that matters: the rules exist twice

This is the change that makes every later mechanic cheap.

`solve.ts` and `game-events/validate-moves.ts` import the same three helpers
and then answer the same question in two different shapes:

| | solver | game |
|---|---|---|
| legal move | `isValidMove` / `isValidTake` | same, separately |
| blocked line | `getSquaresOnTrajectory(...).some(...)` | same, separately |
| held square | excluded from `movesFrom` | `!isHeld(target)` in the click handler |
| hole | excluded from `movesFrom` | **enters it and dies** |

They already disagree — the last row is a deliberate difference, and it lives
in a click handler rather than anywhere a rule is written down. Every mechanic
we add has to be written twice, and nothing makes the two agree.

The fix is one function both sides call:

```
type Outcome =
  | { kind: "illegal" }
  | { kind: "move";    to: Coords }
  | { kind: "capture"; to: Coords; becomes: PieceName }
  | { kind: "death";   at: Coords; cause: "hole" | "watched" | "collapsed" }

resolve(board, state, target): Outcome
```

- the game calls it on a click and dispatches the outcome to events;
- the solver calls it for every square and keeps the `move` and `capture` ones;
- the **metric** calls it and can finally count the `death` ones, which is the
  exposure measure above.

Adding a mechanic then means adding one `Outcome` case and one branch, in one
file, and the solver, the game and the metric all learn it at once.

## Terrain is a digit soup, and it is full

A blueprint square is `0` hole, `1` floor, `2..7` a piece — the piece index
offset by two. Walls, cracked squares and promotion tiles all want to be
terrain, and there is nowhere to put them that is not another magic offset.

Split what is currently one number:

```
terrain[row][col]:  "hole" | "floor" | "wall" | "cracked"
pieces:             PiecePlacement[]
```

The notation has plenty of room (`#` for a wall, `x` for a cracked square), the
blueprint stays a short string, and a new kind of ground stops being an
arithmetic hazard. Cracked squares need this in particular: they are terrain
that **changes during a run**, so they want a per-run overlay over the static
terrain — which is exactly the shape `taken` already has for captured pieces.

## Rendering

### What is there now

Seven canvases, one per face of the extrusion, each now as tall as the whole
level, plus DOM elements for the pieces, scrolled by a CSS transform. At a
20-row level that is about **15 MB of canvas backing store**, and seven elements
whose vertical alignment has to agree — which it did not, a fix ago.

The seven layers are not buying interleaving: nothing sets a z-index on a
piece, so no piece is ever drawn between two board layers. They exist so each
face can be positioned by CSS and filled with one colour per pass.

### What I would do

**Collapse the seven into one.** The same faces drawn back-to-front into a
single canvas, with each face's offset applied at draw time instead of by
element position. It removes the entire class of bug I hit, divides the memory
by seven, and turns the extrusion from a layout problem into a drawing
problem — where it belongs.

Two canvases stay separate, for a reason rather than by inheritance:

- **the lip**, because it must *not* scroll with the board;
- **an overlay**, in board coordinates, on top, cleared and redrawn on demand.

So seven becomes three.

### The overlay is the answer to prototyping

The overlay is what you asked for: a place to draw a mechanic's marks without
building it a proper rendering pass first. One canvas, one `draw(ctx)` callback,
redrawn when the game says something changed. A cracked square gets a scribble,
a watched square gets a tint, a telegraph gets a line. When a mechanic earns its
place, its drawing moves down into the board pass and the scribble goes away.

Paired with a `?debug=` switch — the same shape as `?dev` — an experiment costs
one function and no layout work.

### Should the pieces move onto canvas too?

Not yet. DOM pieces get their move and fall animations from CSS transitions,
plus hit-testing and hover cursors, for free. Drawing them on canvas means
owning a frame loop, and **not having a frame loop is this codebase's best
property** — the compositor does the scrolling on the GPU and the page is idle
between moves.

Even moving enemies do not force one: an enemy that steps square to square can
transition exactly like the player does. The thing that would force a loop is
continuous motion, and nothing on the table needs it.

### WebGL?

No. The board is a few hundred rectangles. WebGL would buy nothing here that
canvas 2D does not already do idly, and it costs a shader pipeline, a resize
story and a class of driver bugs. If we ever want lighting on the extrusion,
that is the conversation — not before.

## An order of work

Each step is useful on its own and none of them needs the next one.

1. **One `resolve`.** No visible change; the rules stop being written twice.
   Everything below gets cheaper.
2. **Terrain as a type, and walls as its first new value.** Proves the seam
   with the cheapest possible mechanic.
3. **The overlay canvas and `?debug=`.** The harness for everything after.
4. **Instant death on a watched square**, behind a switch, measured against the
   wall on the same skeletons.
5. **Cracked squares**, with the solver carrying the collapsed set and the
   fitness gaining an exposure measure.
6. **Seven canvases into one.** Any time; naturally done while touching the
   board pass for 2 or 3.

Sides having a forward direction — the pawn fix — is not on this list because
it is not architecture. It should go in first, on its own, before any of it.
