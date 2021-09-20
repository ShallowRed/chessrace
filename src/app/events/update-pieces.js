import events from 'app/models/events';
import { animationTimeout } from 'app/utils/animation-timeout';

export function MOVE_PLAYER(position) {

  this.player.isMoving = true;

  if (!this.on) {

    events.emit("GAME_ON");
  }

  this.player.updatePosition(position);

  this.player.moveSprite({ duration: this.durations.move });

  animationTimeout(() => {
    this.player.isMoving = false;
  }, this.durations.move)

  if (this.player.position[1] >= this.model.rows) {

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

export function CHECK_BOARD_LIMITS() {

  this.ennemies.collection.forEach(ennemy => {

    events.ask("IS_BELOW_LIMIT", ennemy) &&
      events.emit("ENNEMY_FALL_IN_HOLE", ennemy)
  });

  if (events.ask("IS_BELOW_LIMIT", this.player)) {

    events.emit("PLAYER_FALL_IN_HOLE", this.player);

  } else return true;
}

export function IS_BELOW_LIMIT(piece) {

  return piece.position[1] < this.board.nRenders - 1;
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

  events.timeout("PLAYER_FALL_IN_HOLE", hole, this.durations.move);
}
