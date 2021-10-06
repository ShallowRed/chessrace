import events from 'app/game-events/event-emitter';

export function SCROLL_ONE_SQUARE_DOWN() {

  if (!this.on || this.player.isFalling) return;

  events.emit("TRANSLATE_BOARD", { rows: 1 });

  events.emit("TRANSLATE_PIECES", { rows: this.board.nRenders });

  events.timeout("INIT_NEXT_SCROLL_STEP", this.durations.scroll);
}

export function INIT_NEXT_SCROLL_STEP() {

  if (!this.on) return;

  this.render();

  events.emit("TRANSLATE_BOARD");

  events.emit("KILL_OFFBOARD_PIECES", this.offBoardPieces);

  window.requestAnimationFrame(() => {

    events.emit("SCROLL_ONE_SQUARE_DOWN");
  });
}

export function TRANSLATE_BOARD({ rows } = {}) {

  for (const canvas of this.board.canvas.movableCollection) {

    canvas.translateY({ rows, duration: rows && this.durations.scroll });
  }
}

export function TRANSLATE_PIECES({ rows } = {}) {

  for (const { container } of this.pieces) {

    container.translateY({ rows, duration: rows && this.durations.scroll });
  }
}
