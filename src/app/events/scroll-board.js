import events from 'app/models/events';
// import { animationTimeout } from 'app/utils/animation-timeout';

export function SCROLL_ONE_SQUARE_DOWN() {

  if (!this.on) return;

  events.emit("TRANSLATE_BOARD", { rows: 1 });

  events.emit("TRANSLATE_PIECES", { rows: this.board.nRenders });

  events.timeout("NEXT_SCROLL_STEP", this.durations.scroll);
}

export function NEXT_SCROLL_STEP() {

  if (!this.on) return;

  events.emit("TRANSLATE_BOARD");

  this.render();

  this.ennemies.collection.forEach(ennemy => {

    if (events.ask("IS_BELOW_LIMIT", ennemy)) {

      events.emit("ENNEMY_FALL_IN_HOLE", ennemy)
    }
  });

  if (events.ask("IS_BELOW_LIMIT", this.player)) {

    events.emit("PLAYER_FALL_IN_HOLE", this.player);

    return;
  }

  window.requestAnimationFrame(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN")
  );
}

export function TRANSLATE_BOARD({ rows } = {}) {

  const duration = rows && this.durations.scroll;

  for (const canvas of this.board.canvas.movableCollection) {

    canvas.translateY({ rows, duration });
  }
}

export function TRANSLATE_PIECES({ rows } = {}) {

  const duration = rows && this.durations.scroll;

  this.forEachPiece(piece => {

    piece.container.translateY({ rows, duration })
  });
}
