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

  events.emit("SET_EACH_PIECE", piece =>
    piece.decrementPositionY()
  );

  if (this.player.position[1] < 0) {

    this.player.fall(this.durations.fall);

    animationTimeout(() => {
      events.emit("GAME_OVER");
    }, 1.3);

    return;
  }

  if (this.player.position[1] >= this.model.rows - this.model.skippedRows) {
    events.emit("GAME_WON");
  }

  window.requestAnimationFrame(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN")
  );
}

export function TRANSLATE_BOARD({ rows = 0 } = {}) {

  const duration = rows ? this.durations.translation : 0;

  this.board.canvas.main.translateY({ rows, duration });
  this.board.canvas.trick.translateY({ rows, duration });
}

export function TRANSLATE_PIECES({ rows = 0 } = {}) {

  const duration = rows ? this.durations.translation : 0;

  events.emit("SET_EACH_PIECE", piece =>
    piece.container.translateY({ rows, duration })
  );
}
