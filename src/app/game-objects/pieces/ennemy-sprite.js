import events from 'app/game-events/event-emitter';

import Piece from 'app/game-objects/pieces/piece-sprite';

export default class EnnemyPiece extends Piece {

  constructor(color, { position, pieceName }) {

    super({ color, position, pieceName, type: "ennemy" });

    this.onClick(() => {

      events.emit("ENNEMY_CLICKED", this);
    });
  }

  render() {

    super.render();

    this.setAbsolutePosition();
  }

  setAbsolutePosition() {

    this.container.style = this.offset;
  }
}
