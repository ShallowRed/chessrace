import Board from 'app/components/Board';
import Player from 'app/components/Player';
import Ennemies from 'app/components/ennemies';
import * as GameEvents from 'app/game-events';
import events from 'app/utils/event-emitter';

export default {

  on: false,

  init() {

    for (const message in GameEvents) {
      events.on(message, GameEvents[message].bind(this));
    }

    this.ennemies = Ennemies;

    this.player = new Player();

    this.board = new Board();

    this.board.canvas.addEventListener("mousedown", ({ clientX, clientY }) => {

      events.emit("SQUARE_CLICKED", this.board.getClickedSquare(clientX, clientY));
    })
  }
}
