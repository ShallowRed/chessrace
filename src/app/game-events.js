import events from 'app/utils/event-emitter';
import { isValidMove, isValidTake } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
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

  setTimeout(() =>
    alert("Game Over"),
    100
  );
}

export function GAME_WON() {

  this.on = false;

  setTimeout(() => {
      this.reset();
      alert("Game won");
    },
    500
  );
}

export function SCROLL_ONE_SQUARE_DOWN() {

  if (!this.on) return;

  this.board.translateOneSquareDown(this.translationDuration);

  animationTimeout(() =>
    events.emit("NEXT_SCROLL_STEP"),
    this.translationDuration
  );
}

export function NEXT_SCROLL_STEP() {

  if (!this.on) return;

  this.board.translateOneSquareUp();

  this.render();

  events.emit("SET_EACH_PIECE", piece =>
    piece.decrementPositionY()
  );

  if (this.player.isBeyondLimit()) {

    this.player.fall(this.on);

    animationTimeout(() => {
      events.emit("GAME_OVER");
    }, 1.3);

    return;
  }

  if (this.player.position[1] >= this.model.rows - this.model.skippedRows) {
    events.emit("GAME_WON");
  }

  window.requestAnimationFrame(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN")
  );
}

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

export function RESIZE() {

  GameObject.setSize(this.columns, this.rows);
  this.board.setDimensions();
  this.board.nRenders--;
  this.board.render(this.model);
  this.player.moveSprite({ duration: 0 }, this.model.skippedRows);
  this.ennemies.setEachPosition(this.model.skippedRows);
  events.emit("SET_EACH_PIECE", piece =>
    piece.setSpriteDimensions()
  );
}
