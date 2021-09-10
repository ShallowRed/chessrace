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
    animationTimeout(() => {
      events.emit("GAME_WON");
    }, this.durations.move * 2)
  }
}

export function EAT_PIECE(ennemy) {

  events.emit("MOVE_PLAYER", ennemy.position);
  this.player.updatePiece(ennemy.pieceName);

  animationTimeout(() => {
    events.emit("REMOVE_ENNEMY", ennemy);
  }, this.durations.move)
}

export function REMOVE_ENNEMY(ennemy) {

  if (!this.on) return;

  this.ennemies.remove(ennemy);
  this.model.square.removeEnnemy(ennemy.position);
}

export function CHECK_BOARD_LIMITS() {

  this.ennemies.list.forEach(ennemy => {
    events.ask("IS_BELOW_LIMIT", ennemy) &&
      events.emit("ENNEMY_FALL_IN_HOLE", ennemy)
  });

  if (events.ask("IS_BELOW_LIMIT", this.player)) {

    events.emit("PLAYER_FALL_IN_HOLE", this.player);

  } else return true;
}

export function IS_BELOW_LIMIT(piece) {

  return piece.position[1] < this.skippedRows;
}

export function PLAYER_FALL_IN_HOLE() {

  this.player.fall(this.durations.fall);

  animationTimeout(() => {
    events.emit("GAME_OVER");
  }, this.durations.fall);
}

export function ENNEMY_FALL_IN_HOLE(ennemy) {

  ennemy.fall(this.durations.fall);

  animationTimeout(() => {
    events.emit("REMOVE_ENNEMY", ennemy);
  }, this.durations.fall);
}

export function PLAYER_MOVE_IN_HOLE(hole) {

  events.emit("MOVE_PLAYER", hole);

  animationTimeout(() =>
    events.emit("PLAYER_FALL_IN_HOLE", hole),
    this.durations.move
  );
}

export function SET_EACH_PIECE(callback) {

  [this.player, ...this.ennemies.list].forEach(callback);
}
