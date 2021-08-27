import * as GameEvents from 'app/game-events';
import Ennemies from 'app/ennemies';
import BoardModel from 'app/board-model';
import BoardCanvas from 'app/components/Board-canvas';
import Player from 'app/components/Player';
import events from 'app/utils/event-emitter';

export default {

  init(blueprint) {
    this.ennemies = Ennemies;
    this.player = new Player();
    this.model = new BoardModel(blueprint);
    this.board = new BoardCanvas();
  },
  
  bindEvents() {
    for (const message in GameEvents) {
      if (typeof GameEvents[message] === "function") {
        events.on(message, GameEvents[message].bind(this));
      }
    }
  },

  reset() {
    this.ennemies.reset();
    this.model.reset();
    this.board.reset();
    this.player.reset();
    this.player.moveSprite(0);
  },

  render() {

    const {
      regularSquares,
      newEnnemyPieces
    } = this.model.parse();

    this.board.render(regularSquares);

    if (newEnnemyPieces.length) {
      this.ennemies.addEach(newEnnemyPieces);
    }
  }
}
