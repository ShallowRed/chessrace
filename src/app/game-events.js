import events from 'app/utils/event-emitter';
import { isValidMove, isValidTake } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
import { squareSize, translationDuration } from "app/config";
import { translateY } from "app/utils/utils";

export function START_GAME() {

  this.on = true;

  setTimeout(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN"),
    10
  );
}

export function GAME_OVER() {

  this.on = false;

  this.ennemies.reset();
  this.board.reset();
  this.player.reset();

  setTimeout(() =>
    alert("Game Over"),
    100
  );
}

export function SCROLL_ONE_SQUARE_DOWN() {

  translateY(this.board.map.container, {
    distance: squareSize * (this.board.nRenders),
    duration: translationDuration
  });

  animationTimeout(() =>
    events.emit("NEXT_SCROLL_STEP"),
    translationDuration
  );
}

export function NEXT_SCROLL_STEP() {

  if (!this.on) return;

  this.board.render();

  if (this.player.position[1] < 0) {

    events.emit("GAME_OVER");

  } else {

    window.requestAnimationFrame(() =>
      events.emit("SCROLL_ONE_SQUARE_DOWN")
    );
  }
}

export function SQUARE_CLICKED(square) {

  if (!isValidMove(this.player, square)) return;

  events.emit("MOVE_ATTEMPT", square)
    .then(() => {
      this.player.updatePosition(square);
      this.player.moveSprite();
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
      player.moveSprite();
    })
  }
}

export function MOVE_ATTEMPT(square) {

  const { player: { pieceName, position }, board } = this;

  const pieceCanFall = ["bishop", "rook", "queen"].includes(pieceName);

  if (board.isHole(square)) {

    if (pieceCanFall) {

      const firstObstacle =
        board.getFirstObstacleOnTrajectory(position, square);

      if (firstObstacle) {

        if (firstObstacle.isHole) {

          events.emit("FALL_IN_HOLE", firstObstacle.coords);
        }

        return;
      }
    }

    events.emit("FALL_IN_HOLE", square);

    return;
  }

  if (pieceCanFall) {

    const firstObstacle =
      board.getFirstObstacleOnTrajectory(position, square);

    if (firstObstacle) {

      if (firstObstacle.isHole) {

        events.emit("FALL_IN_HOLE", firstObstacle.coords);
      }

      return;
    }
  }

  if (!this.on) {

    events.emit("START_GAME", square);
  }

  return true;
}

export function FALL_IN_HOLE(square) {

  this.player.updatePosition(square);
  this.player.moveSprite();

  animationTimeout(() => {
    this.player.fall(this.on);
  }, 0.3);

  animationTimeout(() => {
    events.emit("GAME_OVER");
  }, 0.9);
}

export function NEW_ENNEMIES(ennemyPieces) {
  ennemyPieces.forEach(ennemy => {
    events.emit("NEW_ENNEMY", ennemy)
  });
}

export function NEW_ENNEMY({ value, coords }) {
  this.ennemies.add(value, coords, this.board.nRenders)
}

export function REMOVE_ENNEMY(ennemy) {
  this.board.model.removeEnnemy(ennemy.position);
  this.ennemies.remove(ennemy);
}

export function RESET_N_RENDERS() {
  this.ennemies.list.forEach(ennemy =>
    ennemy.nRenders = 0
  );
  this.player.nRenders = 0;
  this.board.nRenders = 0;
  this.board.model.nRenders = 0;
  this.board.map.nRenders = 0;
}

export function INCREMENT_N_RENDERS() {
  this.ennemies.list.forEach(ennemy => {
    ennemy.nRenders++;
    ennemy.position[1]--;
  });
  this.player.position[1]--;
  this.player.nRenders++;
  this.board.nRenders++;
  this.board.model.nRenders++;
  this.board.map.nRenders++;
}
