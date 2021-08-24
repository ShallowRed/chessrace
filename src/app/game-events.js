import events from 'app/utils/event-emitter';
import { isValid } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
import { squareSize, translationDuration } from "app/config";

export function START_GAME() {

  this.on = true;

  setTimeout(() =>
    events.emit("SCROLL_ONE_SQUARE"),
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

export function SCROLL_ONE_SQUARE() {

  const { player, board, ennemies } = this;

  [board, player, ...ennemies.list].forEach(gameObject =>
    gameObject.translateY(squareSize, translationDuration)
  );

  animationTimeout(() =>
    events.emit("NEXT_SCROLL_STEP"),
    translationDuration
  );
}

export function NEXT_SCROLL_STEP() {

  const { player, board, ennemies, on } = this;

  if (!on) return;

  board.clear();
  board.render();

  [player, ...ennemies.list].forEach(piece =>
    piece.moveSpriteOneSquareDown()
  );

  [board, player, ...ennemies.list].forEach(gameObject =>
    gameObject.resetTranslation()
  );

  if (!player.position[1]) {

    events.emit("GAME_OVER");

  } else {

    window.requestAnimationFrame(() =>
      events.emit("SCROLL_ONE_SQUARE")
    );
  }
}

export function SQUARE_CLICKED(clickedSquare) {

  events.emit("MOVE_ATTEMPT", clickedSquare, "moveSprite")
    .then(() => {
      this.player.moveSprite(clickedSquare);
    })
}

export function ENNEMY_CLICKED(ennemy) {

  events.emit("MOVE_ATTEMPT", ennemy.position, "take")
    .then(() => {

      const { player, board, ennemies } = this;

      board.removeEnemy(ennemy.position);
      ennemies.remove(ennemy);

      setTimeout(() => {
        player.updatePiece(ennemy.pieceName);
      })

      player.moveSprite(ennemy.position);
    })
}

export function MOVE_ATTEMPT(square, type) {

  const { player: { pieceName, position }, board } = this;

  if (!isValid[type](pieceName, position, square)) return;

  const pieceCanFall = ["bishop", "rook", "queen"].includes(pieceName);

  if (board.isHole(square)) {

    if (pieceCanFall) {

      const firstObstacle =
        board.getFirstObstacleOnTrajectory(position, square);

      if (firstObstacle && !firstObstacle.isHole) {

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

  this.player.moveSprite(square);

  animationTimeout(() => {
    this.player.fall(this.on);
  }, 0.3);

  animationTimeout(() => {
    events.emit("GAME_OVER");
  }, 0.9);
}

export function NEW_ENNEMY(value, coords) {
  this.ennemies.add(value, coords)
}
