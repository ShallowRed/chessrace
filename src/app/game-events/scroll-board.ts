import events from 'app/game-events/event-emitter';

import type Game from 'app/game';
import type { TranslateOptions } from 'app/game-objects/game-object';

// One transition per row, each starting where the last one ended and heading
// the same way. Nothing is redrawn and nothing snaps back, so a step that
// begins a frame late reads as a pause in the motion, not a jump in the board.
export function SCROLL_ONE_SQUARE_DOWN(this: Game): void {

  if (!this.on || this.player.isFalling) return;

  // This runs as the previous slide lands, so the board has arrived where it
  // was heading. The underside on show belongs to that row and not to the one
  // it is about to leave for: a lip painted a row early inverts the light and
  // dark of every square under it for the whole of the slide.
  this.board.arriveAt(this.step, this.model);

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
