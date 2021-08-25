import events from 'app/utils/event-emitter';
import BoardModel from 'app/components/Board/board-model';
import BoardCanvas from 'app/components/Board/board-canvas';
import { getSquaresOnTrajectory } from 'app/utils/utils';
import { generateMapBlueprint } from 'app/utils/map-generator';

export default class Board {

  constructor() {
    this.model = new BoardModel(generateMapBlueprint());
    this.map = new BoardCanvas();
  }

  reset() {
    events.emit("RESET_N_RENDERS");
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
    events.emit("INCREMENT_N_RENDERS");

    if (!newEnnemyPieces.length) return;
    events.emit("NEW_ENNEMIES", newEnnemyPieces);
  }

  isHole(squareCoord) {
    return this.model.get(squareCoord) === 0;
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
