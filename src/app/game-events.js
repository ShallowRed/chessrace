import events from 'app/utils/event-emitter';
import { isValidMove, isValidTake } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
import { squareSize, translationDuration } from "app/config";

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

  const { player, board, ennemies } = this;

  [board.map, player, ...ennemies.list].forEach(gameObject =>
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

  board.render();

  [player, ...ennemies.list].forEach(piece =>
    piece.moveSpriteOneSquareDown()
  );

  [board.map, player, ...ennemies.list].forEach(gameObject =>
    gameObject.translateY()
  );

  if (player.position[1] < 0) {

    events.emit("GAME_OVER");

  } else {

    window.requestAnimationFrame(() =>
      events.emit("SCROLL_ONE_SQUARE_DOWN")
    );
  }
}

export function SQUARE_CLICKED(square) {

  if (
    !isValidMove(this.player, square)
  ) return;

  events.emit("MOVE_ATTEMPT", square)
    .then(() =>
      this.player.moveSprite(square)
    )
}

export function ENNEMY_CLICKED(ennemy) {

  const { player } = this;

  if (
    !isValidTake(player, ennemy.position)
  ) return;

  events.emit("MOVE_ATTEMPT", ennemy.position)
    .then(eatPiece);

  function eatPiece() {

    events.emit("REMOVE_ENNEMY", ennemy);

    setTimeout(() => {
      player.updatePiece(ennemy.pieceName);
      player.moveSprite(ennemy.position);
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

  this.player.moveSprite(square);

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
  this.ennemies.add(value, coords)
}

export function REMOVE_ENNEMY(ennemy) {
  this.board.model.removeEnnemy(ennemy.position);
  this.ennemies.remove(ennemy);
}
