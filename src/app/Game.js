import * as GameEvents from 'app/game-events';
import Player from 'app/components/Player';
import Board from 'app/components/Board';
import events from 'app/utils/event-emitter';

export default {

  on: false,
  startPos: [2, 3],
  startPiece: "queen",
  translationDuration: 2,

  init() {

    for (const message in GameEvents) {
      events.on(message, GameEvents[message].bind(this));
    }

    this.board = new Board();

    this.player = new Player(this.startPiece, this.startPos);

    this.board.canvas.addEventListener("mousedown", ({ clientX, clientY }) => {

      events.emit("SQUARE_CLICKED", this.board.getClickedSquare(clientX, clientY));
    })
  }
}
