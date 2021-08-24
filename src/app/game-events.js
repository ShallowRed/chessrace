import events from 'app/utils/event-emitter';
import { isValid } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
import { Ennemies } from 'app/components/ennemies';

export function START_GAME() {

  this.on = true;

  setTimeout(() =>
    events.emit("SCROLL_ONE_SQUARE"),
    10
  );
}

export function GAME_OVER() {

  this.on = false;

  Ennemies.reset();
  this.board.reset();
  this.player.reset(this);

  setTimeout(() =>
    alert("Game Over"),
    100
  );
}

export function SCROLL_ONE_SQUARE() {

  const { player, board, translationDuration } = this;

  [board, player, ...Ennemies.list].forEach(gameObject =>
    gameObject.translateY(board.squareSize, translationDuration)
  );

  animationTimeout(() =>
    events.emit("NEXT_SCROLL_STEP"),
    translationDuration
  );
}

export function NEXT_SCROLL_STEP() {

  const { player, board, on } = this;

  if (!on) return;

  board.clear();
  board.render();

  [player, ...Ennemies.list].forEach(piece =>
    piece.moveOneSquareDown()
  );

  [board, player, ...Ennemies.list].forEach(gameObject =>
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

  events.emit("MOVE_ATTEMPT", clickedSquare, "move")
    .then(() => {
      this.player.move(clickedSquare);
    })
}

export function ENNEMY_CLICKED(ennemy) {

  events.emit("MOVE_ATTEMPT", ennemy.position, "take")
    .then(() => {

      const { player, board } = this;

      board.removeEnemy(ennemy.position);
      Ennemies.remove(ennemy);

      setTimeout(() => {
        player.updatePiece(ennemy.pieceName);
      })

      player.move(ennemy.position);
    })
}

export function MOVE_ATTEMPT(square, type) {

  const { player: { pieceName, position }, board } = this;

  if (!isValid[type](pieceName, position, square)) return;

  if (board.isHole(square)) {
    events.emit("FALL_IN_HOLE", square);
    return;
  }

  if (["bishop", "rook", "queen"].includes(pieceName)) {

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

  this.player.move(square);

  animationTimeout(() => {
    this.player.fall(this.on);
  }, 0.3);

  animationTimeout(() => {
    events.emit("GAME_OVER");
  }, 0.9);
}
