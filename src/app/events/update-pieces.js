import events from 'app/models/events';
import { animationTimeout } from 'app/utils/animation-timeout';

export function MOVE_PLAYER(position) {

  if (!this.on) {
    events.emit("GAME_ON");
  }

  this.player.updatePosition(position);

  this.player.moveSprite({ duration: this.durations.move }, this.model
    .skippedRows);

    if (this.player.position[1] >= this.model.rows - this.model.skippedRows) {
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

export function PLAYER_FALL_IN_HOLE(hole) {

  events.emit("MOVE_PLAYER", hole);

  animationTimeout(() => {

    this.player.fall(this.durations.fall);

    animationTimeout(() => {
      events.emit("GAME_OVER");
    }, this.durations.fall);

  }, this.durations.move);
}

export function ENNEMY_FALL(ennemy) {

  ennemy.fall(this.durations.fall);

  animationTimeout(() => {
    events.emit("REMOVE_ENNEMY", ennemy);
  }, this.durations.fall);
}

export function SET_EACH_PIECE(callback) {

  [this.player, ...this.ennemies.list].forEach(callback);
}
