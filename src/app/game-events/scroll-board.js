import events from 'app/game-events/event-emitter';
// import { animationTimeout } from 'app/utils/animation-timeout';

import { test } from "app/utils/test";

export function SCROLL_ONE_SQUARE_DOWN() {

  if (!this.on || this.player.isFalling) return;

  events.emit("TRANSLATE_BOARD", { rows: 1 });

  events.emit("TRANSLATE_PIECES", { rows: this.board.nRenders });

  events.timeout("INIT_NEXT_SCROLL_STEP", this.durations.scroll);
}

export function INIT_NEXT_SCROLL_STEP() {

  if (!this.on) return;

  events.emit("TRANSLATE_BOARD");

  this.render();

  for (const piece of this.offBoardPieces) {

    piece.fall(this.durations.fall);

  }

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


  // this.pieces.forEach(({ container }) => {
  //
  //   container.translateY({ rows, duration: rows && this.durations.scroll });
  // });
}
