import events from 'app/models/events';

import { isValidMove, isValidTake, isLongRange } from 'app/models/pieces';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

export function IS_VALID_MOVE(targetSquare) {

  return isValidMove(this.player, targetSquare) &&
    this.model.square.isInBoard(targetSquare);
}

export function IS_VALID_TAKE(ennemyPosition) {

  return isValidTake(this.player, ennemyPosition);
}

export function IS_VALID_TRAJECTORY(targetSquare) {

  const squaresOnTrajectory = [];

  if (isLongRange(this.player.pieceName)) {

    squaresOnTrajectory.push(
      ...getSquaresOnTrajectory(this.player.position, targetSquare)
    );

    const ennemiesBeforeTargetSquare = squaresOnTrajectory
      .filter(this.model.square.isEnnemy);

    if (ennemiesBeforeTargetSquare.length) return;
  }

  const holes = [...squaresOnTrajectory, targetSquare]
    .filter(this.model.square.isHole);

  if (holes.length) {

    events.emit("PLAYER_MOVE_THEN_FALL_IN_HOLE", holes[0]);

  } else return true;
}
