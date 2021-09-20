import events from 'app/models/events';

import { isValidMove, isValidTake, isLongRange } from 'app/models/pieces';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

export function IS_VALID_MOVE(targetSquare) {

  return isValidMove(this.player, targetSquare) &&
    this.board.square.is.inBoard(targetSquare);
}

export function IS_VALID_TAKE(ennemyPosition) {

  return isValidTake(this.player, ennemyPosition);
}

export function IS_VALID_TRAJECTORY(targetSquare) {

  const firstObstacle =
    isLongRange(this.player.pieceName) &&
    getSquaresOnTrajectory(this.player.position, targetSquare)
    .find(this.model.square.isObstacle);

  const hole =
    this.model.square.getIfHole(firstObstacle) ||
    this.model.square.getIfHole(targetSquare);

  if (hole) {

    events.emit("PLAYER_MOVE_THEN_FALL_IN_HOLE", hole);
  }

  return !firstObstacle && !hole;
}
