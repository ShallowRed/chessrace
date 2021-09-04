import events from 'app/utils/event-emitter';
import { isValidMove, isValidTake } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';

export function SQUARE_CLICKED(square) {

  if (
    !isValidMove(this.player, square) ||
    square[0] >= this.columns ||
    square[0] < 0 ||
    square[1] < 0
  ) return;

  events.emit("MOVE_ATTEMPT", square)
    .then(() => {
      this.player.updatePosition(square);
      this.player.moveSprite({ duration: this.spriteSpeed }, this.model
        .skippedRows);
    })
}

export function ENNEMY_CLICKED(ennemy) {

  const { player, spriteSpeed, model } = this;

  if (!isValidTake(player, ennemy.position)) return;

  events.emit("MOVE_ATTEMPT", ennemy.position)
    .then(eatPiece);

  function eatPiece() {

    events.emit("REMOVE_ENNEMY", ennemy);

    setTimeout(() => {
      player.updatePiece(ennemy.pieceName);
      player.updatePosition(ennemy.position);
      player.moveSprite({ duration: spriteSpeed }, model.skippedRows);
    })
  }
}

export function MOVE_ATTEMPT(square) {

  if (
    ["bishop", "rook", "queen"].includes(this.player.pieceName)
  ) {

    const firstObstacle =
      this.model.getFirstObstacleOnTrajectory(this.player.position, square);

    if (firstObstacle) {

      if (firstObstacle.isHole) {

        events.emit("FALL_IN_HOLE", firstObstacle.position);
      }

      return;
    }
  }

  if (this.model.isHole(square)) {

    events.emit("FALL_IN_HOLE", square);

    return;
  }

  if (!this.on) {

    events.emit("START_GAME", square);
  }

  return true;
}

export function SET_EACH_PIECE(callback) {
  [this.player, ...this.ennemies.list].forEach(callback);
}

export function FALL_IN_HOLE(square) {

  this.player.updatePosition(square);
  this.player.moveSprite({ duration: this.spriteSpeed }, this.model
    .skippedRows);

  animationTimeout(() => {
    this.player.fall(this.on);
  }, 0.3);

  animationTimeout(() => {
    events.emit("GAME_OVER");
  }, 1.3);
}

export function REMOVE_ENNEMY(ennemy) {
  if (!this.on) return;
  this.ennemies.remove(ennemy);
  this.model.removeEnnemy(ennemy.position);
}
