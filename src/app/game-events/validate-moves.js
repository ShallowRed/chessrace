import events from 'app/game-events/event-emitter';

import { animationTimeout } from 'app/utils/animation-timeout';

import {
  isValidMove,
  isValidTake,
  isLongRange
} from 'app/game-objects/pieces/models/pieces-movements';

import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

export function CANVAS_CLICKED(evt) {

  const targetSquare = this.board.getSquare.clicked(evt);

  if (
    isValidMove(this.player, targetSquare) &&
    this.model.square.isInBoard(targetSquare) &&
    events.ask("IS_ALLOWED_MOVING") &&
    events.ask("IS_VALID_TRAJECTORY", targetSquare)
  ) {

    events.emit("MOVE_PLAYER", targetSquare);
  }
}

export function ENEMY_CLICKED(enemy) {

  if (
    isValidTake(this.player, enemy.position) &&
    events.ask("IS_ALLOWED_MOVING") &&
    events.ask("IS_VALID_TRAJECTORY", enemy.position)
  ) {

    events.emit("EAT_PIECE", enemy);
  }
}

export function IS_ALLOWED_MOVING() {

  return (
    !this.player.isMoving &&
    !this.player.isFalling
  )
}

export function IS_VALID_TRAJECTORY(targetSquare) {

  const squaresOnTrajectory = [];

  const { isEnemy, isHole } = this.model.square;

  if (isLongRange(this.player.pieceName)) {

    squaresOnTrajectory.push(
      ...getSquaresOnTrajectory(this.player.position, targetSquare)
    );

    if (squaresOnTrajectory.some(isEnemy)) return;
  }

  const hole = [...squaresOnTrajectory, targetSquare].find(isHole);

  if (hole) {

    events.emit("MOVE_PLAYER", hole);
    
    animationTimeout(() => {
      this.player.fall(this.durations.fall)
    }, this.durations.move);

  } else return true;
}
