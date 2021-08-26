import events from 'app/utils/event-emitter';
import Piece from 'app/components/Pieces/Piece';
import { piecesColors } from 'app/config';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position) {

    super({
      pieceName,
      color: piecesColors[1],
      className: "ennemy"
    });

    this.updatePosition(position);

    const { left, bottom } = this.getOffset();

    this.sprite.style.left = `${left}px`;
    this.sprite.style.bottom = `${bottom}px`;

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  decrementPositionY() {
    super.decrementPositionY();
    if (this.isBeyondLimit()) {
      events.emit("REMOVE_ENNEMY", this);
    }
  }
}
