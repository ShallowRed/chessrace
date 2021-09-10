import events from 'app/models/events';
import { isValidMove, isValidTake, isLongRange } from 'app/models/pieces';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';

export function IS_VALID_MOVE(square) {

  const isInBoard = ([col, row]) =>
    col >= 0 &&
    row >= 0 &&
    col < this.columns &&
    row <= this.rows;

  if (
    isValidMove(this.player, square) &&
    isInBoard(square)
  ) return true;
}

export function IS_VALID_TAKE(square) {

  return isValidTake(this.player, square);
}

export function IS_VALID_TRAJECTORY(targetSquare) {

  const firstObstacle =
    isLongRange(this.player.pieceName) &&
    getSquaresOnTrajectory(this.player.position, targetSquare)
    .find(this.model.square.isObstacle);

  const getHole = square =>
    this.model.square.isHole(square) && square

  const hole = firstObstacle && getHole(firstObstacle) ||
    getHole(targetSquare);

  hole && events.emit("PLAYER_MOVE_IN_HOLE", hole);

  return !firstObstacle && !hole;
}
