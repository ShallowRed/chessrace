import events from 'app/game-events/event-emitter';

import { animationTimeout } from 'app/utils/animation-timeout';

export function MOVE_PLAYER(position) {

  if (!this.on) {

    events.emit("GAME_ON");
  }

  this.player.updatePosition(position);

  this.player.moveSprite({ duration: this.durations.move });

  if (this.player.position[1] === this.model.rows) {

    events.timeout("GAME_WON", this.durations.move * 2);
  }
}

export function EAT_PIECE(ennemy) {

  events.emit("MOVE_PLAYER", ennemy.position);

  this.player.updatePiece(ennemy.pieceName);

  setTimeout(() => {

    this.ennemies.remove(ennemy);

  }, this.durations.move * 800);
}

export function KILL_OFFBOARD_PIECES(offBoardPieces) {

  if (!offBoardPieces.length) return;

  for (const piece of offBoardPieces) {

    piece.fall(this.durations.fall);
  }

  setTimeout(() => {

    this.ennemies.removeEach(offBoardPieces.filter(piece => !piece.isPlayer));

  }, this.durations.fall * 800);
}
