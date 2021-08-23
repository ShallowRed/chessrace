import * as GameEvents from 'app/game-events';
import Player from 'app/components/Player';
import Map from 'app/components/Map';
import events from 'app/utils/event-emitter';

export default {

  on: false,
  startPos: [2, 3],
  startPiece: "queen",
  translationDuration: 2,

  init() {

    for (const message in GameEvents) {
      // console.log(GameEvents[message]);
      // console.log(GameEvents[message].bind(this));
      events.on(message, GameEvents[message].bind(this));
    }

    // for (const [key,value] of Object.entries(GameEvents)) {
    //   events.on(key, value.bind(this));
    // }

    this.map = new Map();

    this.player = new Player("knight", this.map);

    this.player.reset(this);

    this.map.canvas.addEventListener("mousedown", ({ clientX, clientY }) => {

      events.emit("SQUARE_CLICKED", this.map.getClickedSquare(clientX, clientY));
    })
  }
}
