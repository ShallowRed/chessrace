import events from 'app/utils/event-emitter';
import BoardModel from 'app/components/Board/board-model';
import BoardCanvas from 'app/components/Board/board-canvas';
import { getSquaresOnTrajectory } from 'app/utils/utils';

export default class Board {

  constructor() {
    this.model = new BoardModel();
    this.map = new BoardCanvas();
    this.reset();
  }

  reset() {
    this.model.reset();
    this.map.reset();
    this.render();
  }

  render() {

    const {
      regularSquares,
      newEnnemyPieces
    } = this.model.parse();

    this.map.render(regularSquares);

    if (!newEnnemyPieces.length) return;

    events.emit("NEW_ENNEMIES", newEnnemyPieces);
  }

  isHole(squareCoord) {
    return !this.model.get(squareCoord);
  }

  isEnnemy(squareCoord) {
    return typeof this.model.get(squareCoord) === "string";
  }

  getFirstObstacleOnTrajectory(currentPosition, targetSquare) {

    const isObstacle = square =>
      this.isHole(square) || this.isEnnemy(square)

    const firstObstacle =
      getSquaresOnTrajectory(currentPosition, targetSquare)
      .find(isObstacle);

    if (firstObstacle) return {
      coords: firstObstacle,
      isHole: this.isHole(firstObstacle)
    }
  }
}
