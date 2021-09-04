import events from 'app/models/events';
import { isValidMove, isValidTake, isLongRange } from 'app/models/pieces';

export function CHECK_MOVE(square) {

  const isInBoard = ([col, row]) =>
    col >= 0 &&
    row >= 0 &&
    col < this.columns &&
    row + this.model.skippedRows <= this.rows;

  if (
    isValidMove(this.player, square) &&
    isInBoard(square)
  ) return true;
}

export function CHECK_TAKE(square) {

  return isValidTake(this.player, square);
}

export function CHECK_TRAJECTORY(targetSquare) {

  const hasNoObstacles = checkObstacles(this.player, targetSquare, this.model);

  if (!hasNoObstacles) return;

  if (this.model.isHole(targetSquare)) {

    events.emit("PLAYER_FALL_IN_HOLE", targetSquare);

  } else return true;
}

function checkObstacles({ pieceName, position }, targetSquare, model) {

  if (!isLongRange(pieceName)) return true;

  const firstObstacle =
    model.getFirstObstacleOnTrajectory(position, targetSquare);

  if (firstObstacle) {

    if (firstObstacle.isHole) {

      events.emit("PLAYER_FALL_IN_HOLE", firstObstacle.position);
    }

    return;
  }

  return true;
}
