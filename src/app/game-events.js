import events from 'app/utils/event-emitter';
import { isValid } from 'app/utils/pieces';
import { animationTimeout } from 'app/utils/animation-timeout';
import { Ennemies } from 'app/components/ennemies';

export function START_GAME() {

  this.on = true;

  setTimeout(() =>
    events.emit("SCROLL_B0ARD"),
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

export function SCROLL_B0ARD() {

  const { player, board, translationDuration } = this;

  [board, player, ...Ennemies.list].forEach(el =>
    el.translateY(board.squareSize, translationDuration)
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

  [player, ...Ennemies.list].forEach(piece => {
    piece.moveOneSquareDown();
  });

  [board, player, ...Ennemies.list].forEach(part =>
    part.resetTranslation()
  );

  if (player.position[1] === 0) {
    events.emit("GAME_OVER");
  } else {
    window.requestAnimationFrame(() =>
      events.emit("SCROLL_B0ARD")
    );
  }
}

export function SQUARE_CLICKED(clickedSquare) {

  events.emit("MOVE_ATTEMPT", clickedSquare, "move")
    .then(() => {
      this.player.moveToSquare(clickedSquare);
    })
}

export function ENNEMY_CLICKED(ennemy) {

  events.emit("MOVE_ATTEMPT", ennemy.position, "take")
    .then(() => {

      const { player, board } = this;

      board.removeEnemy(ennemy.position);
      Ennemies.remove(ennemy);

      setTimeout(() => {
        player.sprite.style.transitionDuration = 0;
        player.updatePiece(ennemy.pieceName);
      })

      player.moveToSquare(ennemy.position);
    })
}

export function MOVE_ATTEMPT(square, type) {

  const { player: { pieceName, position }, board } = this;

  events.emit("SQUARE_DOWN", square);

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

  this.player.moveToSquare(square);

  animationTimeout(() => {
    this.player.fall(this.on);
  }, 0.3);

  animationTimeout(() => {
    events.emit("GAME_OVER");
  }, 0.9);
}

// export function SQUARE_DOWN(square) {
//
//   if (this.board.isHole(square)) return;
//
//   this.board.renderDownSquare(square, 2);
//
//   animationTimeout(() => {
//     this.board.renderDownSquare(square, 4);
//   }, 0.05);
//
//   animationTimeout(() => {
//     this.board.fillSquare(square);
//   }, 0.15);
//
//   animationTimeout(() => {
//     this.board.renderDownSquare(square, 2);
//   }, 0.16);
//
//   animationTimeout(() => {
//     this.board.fillSquare(square);
//   }, 0.2);
// }
