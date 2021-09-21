import events from 'app/models/events';

export function MOVE_PLAYER(position) {

  if (!this.on) {

    events.emit("GAME_ON");
  }

  this.player.updatePosition(position);

  this.player.moveSprite({ duration: this.durations.move });

  if (events.ask("IS_PLAYER_ON_FINISHLINE")) {

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

  this.model.square.removeEnnemy(ennemy.position);
}

export function IS_BELOW_BOARD(piece) {

  return piece.position[1] < this.board.nRenders - 1;
}

export function IS_PLAYER_ON_FINISHLINE() {

  return this.player.position[1] === this.model.rows
}

export function PLAYER_FALL_IN_HOLE() {

  this.player.fall(this.durations.fall);

  events.timeout("GAME_OVER", this.durations.fall);
}

export function ENNEMY_FALL_IN_HOLE(ennemy) {

  ennemy.fall(this.durations.fall);

  events.timeout("REMOVE_ENNEMY", ennemy, this.durations.fall);
}

export function PLAYER_MOVE_THEN_FALL_IN_HOLE(hole) {

  events.emit("MOVE_PLAYER", hole);

  events.timeout("PLAYER_FALL_IN_HOLE", this.durations.move);
}
