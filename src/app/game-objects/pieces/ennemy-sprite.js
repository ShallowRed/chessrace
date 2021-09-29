import events from 'app/game-events/event-emitter';

import Piece from 'app/game-objects/pieces/piece-sprite';

export default class EnnemyPiece extends Piece {

  constructor(color, { position, pieceName }) {

    super({ position, pieceName, color, className: "ennemy" });

    this.onClick(() => {

      events.emit("ENNEMY_CLICKED", this);
    });
  }

  render() {

    super.render();

    this.setAbsolutePosition();
  }

  setAbsolutePosition() {

    const offset = this.getOffset();

    this.container.setStyle(offset);
  }
}
