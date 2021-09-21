import events from 'app/models/events';

import { isValidMove, isValidTake, isLongRange } from 'app/models/pieces';
import { getSquaresOnTrajectory } from 'app/utils/get-squares-on-trajectory';
import { filterMap } from 'app/utils/filter-and-map-array';

export function IS_VALID_MOVE(targetSquare) {

  return isValidMove(this.player, targetSquare) &&
    this.board.square.is.inBoard(targetSquare);
}

export function IS_VALID_TAKE(ennemyPosition) {

  return isValidTake(this.player, ennemyPosition);
}

export function IS_VALID_TRAJECTORY(targetSquare) {

  const squaresOnTrajectory =
    isLongRange(this.player.pieceName) &&
    getSquaresOnTrajectory(this.player.position, targetSquare);

  const obstacles = squaresOnTrajectory.filter(coords =>
    this.model.square.isObstacle(coords)
  )
  // const obstacles = filterMap(squaresOnTrajectory, {
  //   filter: ({ value }) => this.model.square.isObstacle(value)
  //   map: ({ value }) => ({
  //     coords: value,
  //     type: this.model.square.isHole(value) ? "hole" : "piece"
  //   })
  // });

  const canGoHere = !obstacles.filter(this.model.square.isPiece).length;

  if (!canGoHere) return;

  const firstHole = obstacles.filter(this.model.square.isPiece)
    ?.[0]?.coords ||
    this.model.square.isHole(targetSquare) && targetSquare;

  if (firstHole) {

    events.emit("PLAYER_MOVE_THEN_FALL_IN_HOLE", firstHole);

    return
  }

  return true;
}
