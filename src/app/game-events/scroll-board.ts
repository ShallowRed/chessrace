import events from 'app/game-events/event-emitter';

import type Game from 'app/game';
import type { TranslateOptions } from 'app/game-objects/game-object';

export function SCROLL_ONE_SQUARE_DOWN(this: Game): void {

  if (!this.on || this.player.isFalling) return;

  events.emit("TRANSLATE_BOARD", { rows: 1 });

  events.emit("TRANSLATE_PIECES", { rows: this.board.nRenders });

  events.timeout("INIT_NEXT_SCROLL_STEP", this.scrollDuration);
}

export function INIT_NEXT_SCROLL_STEP(this: Game): void {

  if (!this.on) return;

  this.render();

  events.emit("TRANSLATE_BOARD");

  events.emit("KILL_OFFBOARD_PIECES", this.offBoardPieces);

  window.requestAnimationFrame(() => {

    events.emit("SCROLL_ONE_SQUARE_DOWN");
  });
}

export function TRANSLATE_BOARD(this: Game, { rows }: TranslateOptions = {}): void {

  for (const canvas of this.board.canvas.movableCollection) {

    canvas.translateY({ rows, duration: rows && this.scrollDuration });
  }
}

export function TRANSLATE_PIECES(this: Game, { rows }: TranslateOptions = {}): void {

  for (const { container } of this.pieces) {

    container?.translateY({ rows, duration: rows && this.scrollDuration });
  }
}
