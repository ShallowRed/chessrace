import events from 'app/models/events';
import { animationTimeout } from 'app/utils/animation-timeout';

export function MOVE_PLAYER(position) {

  if (!this.on) {
    events.emit("GAME_ON");
  }

  this.player.updatePosition(position);

  this.player.moveSprite({ duration: this.duration.move }, this.model
    .skippedRows);
}

export function EAT_PIECE(ennemy) {

  events.emit("REMOVE_ENNEMY", ennemy);
  events.emit("MOVE_PLAYER", ennemy.position);
  this.player.updatePiece(ennemy.pieceName);
}

export function REMOVE_ENNEMY(ennemy) {

  if (!this.on) return;

  this.ennemies.remove(ennemy);
  this.model.removeEnnemy(ennemy.position);
}

export function PLAYER_FALL_IN_HOLE(hole) {

  events.emit("MOVE_PLAYER", hole);

  animationTimeout(() => {

    this.player.fall(this.duration.fall);

    animationTimeout(() => {
      events.emit("GAME_OVER");
    }, this.duration.fall);

  }, this.duration.move);
}

export function ENNEMY_FALL(ennemy) {

  ennemy.fall(this.duration.fall);

  animationTimeout(() => {
    events.emit("REMOVE_ENNEMY", ennemy);
  }, this.duration.fall);
}

export function SET_EACH_PIECE(callback) {

  [this.player, ...this.ennemies.list].forEach(callback);
}
