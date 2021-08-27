import events from 'app/utils/event-emitter';
import Piece from 'app/components/Piece';
import { piecesColors } from 'app/config';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position) {

    super({
      color: piecesColors[1],
      className: "ennemy"
    });

    this.updatePiece(pieceName);
    this.updatePosition(position);
    this.setAbsolutePosition();

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  setAbsolutePosition() {

    const { left, bottom } = this.getOffset();

    this.sprite.style.left = `${left}px`;
    this.sprite.style.bottom = `${bottom}px`;
  }

  decrementPositionY() {
    super.decrementPositionY();
    if (this.isBeyondLimit()) {
      events.emit("REMOVE_ENNEMY", this);
    }
  }
}
