import events from 'app/game-events/event-emitter';

import type Game from 'app/game';
import type { TranslateOptions } from 'app/game-objects/game-object';

// One transition per row, each starting where the last one ended and heading
// the same way. Nothing is redrawn and nothing snaps back, so a step that
// begins a frame late reads as a pause in the motion, not a jump in the board.
export function SCROLL_ONE_SQUARE_DOWN(this: Game): void {

  if (!this.on || this.player.isFalling) return;

  // The underside on show belongs to the row that has just reached the edge of
  // the window, which is the one the board arrived at — not the one it is
  // leaving for. Painting it after the step ahead runs the lip a row early for
  // the whole of the slide, which inverts the light and dark of every square.
  this.board.renderLip(this.model, this.step);

  this.step++;

  const moved = { rows: this.step, duration: this.scrollDuration };

  events.emit("TRANSLATE_BOARD", moved);

  events.emit("TRANSLATE_PIECES", moved);

  events.emit("KILL_OFFBOARD_PIECES", this.offBoardPieces);

  events.timeout("SCROLL_ONE_SQUARE_DOWN", this.scrollDuration);
}

export function TRANSLATE_BOARD(this: Game, options: TranslateOptions = {}): void {

  for (const canvas of this.board.canvas.movableCollection) {

    canvas.translateY(options);
  }
}

export function TRANSLATE_PIECES(this: Game, options: TranslateOptions = {}): void {

  for (const { container } of this.pieces) {

    container?.translateY(options);
  }
}
