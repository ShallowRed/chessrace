import events from 'app/models/events';
import { animationTimeout } from 'app/utils/animation-timeout';

export function SCROLL_ONE_SQUARE_DOWN() {

  if (!this.on) return;

  events.emit("TRANSLATE_BOARD", { rows: 1 });
  events.emit("TRANSLATE_PIECES", { rows: this.board.nRenders });

  animationTimeout(() =>
    events.emit("NEXT_SCROLL_STEP"),
    this.durations.translation
  );
}

export function NEXT_SCROLL_STEP() {

  if (!this.on) return;

  events.emit("TRANSLATE_BOARD");

  this.render();

  events.ask("CHECK_BOARD_LIMITS") &&
    window.requestAnimationFrame(() =>
      events.emit("SCROLL_ONE_SQUARE_DOWN")
    );
}

export function TRANSLATE_BOARD({ rows } = {}) {

  const duration = rows && this.durations.translation;

  for (const canvas of this.board.canvas.movableCollection) {

    canvas.translateY({ rows, duration });
  }
}

export function TRANSLATE_PIECES({ rows } = {}) {

  const duration = rows && this.durations.translation;

  this.forEachPiece(piece => {

    piece.container.translateY({ rows, duration })
  });
}
