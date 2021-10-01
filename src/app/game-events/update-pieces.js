import events from 'app/game-events/event-emitter';

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

  events.timeout("REMOVE_ENNEMY", ennemy, this.durations.move);
}

export function REMOVE_ENNEMY(ennemy) {

  if (!this.on) return;

  this.ennemies.remove(ennemy);
}
