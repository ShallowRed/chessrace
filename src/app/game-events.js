import events from 'app/utils/event-emitter';
import { isValidMove, isValidTake } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
import { translationDuration, spriteSpeed } from "app/config";
import { translateY } from "app/utils/utils";
import GameObject from 'app/components/Game-object';

export function START_GAME() {

  this.on = true;

  setTimeout(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN"),
    10
  );
}

export function GAME_OVER() {

  this.on = false;
  this.reset();
  this.render();

  setTimeout(() =>
    alert("Game Over"),
    100
  );
}

export function SCROLL_ONE_SQUARE_DOWN() {

  if (!this.on) return;

  translateY(GameObject.container, {
    distance: GameObject.squareSize * this.board.nRenders,
    duration: translationDuration
  });

  // translateY(this.board.laser.domEl, {
  //   distance: - GameObject.squareSize * this.board.nRenders,
  //   duration: translationDuration
  // });

  animationTimeout(() =>
    events.emit("NEXT_SCROLL_STEP"),
    translationDuration
  );
}

export function NEXT_SCROLL_STEP() {

  if (!this.on) return;

  this.render();
  GameObject.skippedRows++;

  events.emit("SET_EACH_PIECE", piece =>
    piece.decrementPositionY()
  );

  if (this.player.isBeyondLimit()) {
    events.emit("GAME_OVER");
  }

  window.requestAnimationFrame(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN")
  );
}

export function SQUARE_CLICKED(square) {

  if (!isValidMove(this.player, square)) return;

  events.emit("MOVE_ATTEMPT", square)
    .then(() => {
      this.player.updatePosition(square);
      this.player.moveSprite({ duration: spriteSpeed });
    })
}

export function ENNEMY_CLICKED(ennemy) {

  const { player } = this;

  if (!isValidTake(player, ennemy.position)) return;

  events.emit("MOVE_ATTEMPT", ennemy.position)
    .then(eatPiece);

  function eatPiece() {

    events.emit("REMOVE_ENNEMY", ennemy);

    setTimeout(() => {
      player.updatePiece(ennemy.pieceName);
      player.updatePosition(ennemy.position);
      player.moveSprite({ duration: spriteSpeed });
    })
  }
}

export function MOVE_ATTEMPT(square) {

  const hasObstacleOnTrajectory = (() => {

    if (
      !["bishop", "rook", "queen"].includes(this.player.pieceName)
    ) return;

    const firstObstacle =
      this.model.getFirstObstacleOnTrajectory(this.player.position, square);

    if (firstObstacle) {

      if (firstObstacle.isHole) {

        events.emit("FALL_IN_HOLE", firstObstacle.position);
      }

      return true;
    }
  })();

  if (this.model.isHole(square)) {

    if (hasObstacleOnTrajectory) return;

    events.emit("FALL_IN_HOLE", square);

    return;
  }

  if (hasObstacleOnTrajectory) return;

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
  this.player.moveSprite({ duration: spriteSpeed });

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
