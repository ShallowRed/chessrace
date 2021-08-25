import Board from 'app/components/Board/Board';
import Player from 'app/components/Pieces/Player';
import Ennemies from 'app/components/ennemies';
import * as GameEvents from 'app/game-events';
import events from 'app/utils/event-emitter';

export default {

  on: false,

  init() {

    for (const message in GameEvents) {
      if (typeof GameEvents[message] === "function") {
        events.on(message, GameEvents[message].bind(this));
      }
    }

    this.ennemies = Ennemies;
    this.player = new Player();
    this.board = new Board();

    this.board.reset();
    this.player.reset();
  }
}
