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

  window.requestAnimationFrame(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN")
  );
}

export function TRANSLATE_BOARD({ rows } = {}) {

  const duration = rows && this.durations.translation;

  this.board.canvas.shadows.translateY({ rows, duration });
  this.board.canvas.frontFace.translateY({ rows, duration });
  this.board.canvas.rightFaces.translateY({ rows, duration });
  this.board.canvas.bottomFaces.translateY({ rows, duration });
}

export function TRANSLATE_PIECES({ rows } = {}) {

  const duration = rows && this.durations.translation;

  events.emit("SET_EACH_PIECE", piece =>
    piece.container.translateY({ rows, duration })
  );
}
