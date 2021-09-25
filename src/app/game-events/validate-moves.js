import events from 'app/game-events/event-emitter';

import { isValidMove, isValidTake,
  isLongRange } from 'app/game-objects/pieces/models/pieces-movements/';
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

export function ENNEMY_CLICKED(ennemy) {

  if (
    isValidTake(this.player, ennemy.position) &&
    events.ask("IS_ALLOWED_MOVING") &&
    events.ask("IS_VALID_TRAJECTORY", ennemy.position)
  ) {

    events.emit("EAT_PIECE", ennemy);
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

  const { isEnnemy, isHole } = this.model.square;

  if (isLongRange(this.player.pieceName)) {

    squaresOnTrajectory.push(
      ...getSquaresOnTrajectory(this.player.position, targetSquare)
    );

    if (squaresOnTrajectory.some(isEnnemy)) return;
  }

  const hole = [...squaresOnTrajectory, targetSquare].find(isHole);

  if (hole) {

    events.emit("PLAYER_MOVE_THEN_FALL_IN_HOLE", hole);

  } else return true;
}
