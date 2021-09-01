import events from 'app/utils/event-emitter';
import Piece from 'app/components/pieces/Piece';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position, color, skippedRows) {

    super({
      position,
      pieceName,
      color,
      className: "ennemy"
    });

    this.setAbsolutePosition(skippedRows);

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  setAbsolutePosition(skippedRows) {

    const { left, bottom } = this.getOffset(skippedRows);

    this.sprite.style.left = `${left}px`;
    this.sprite.style.bottom = `${bottom}px`;
  }

  decrementPositionY() {
    super.decrementPositionY();
    if (this.isBeyondLimit()) {
      this.fall();
      setTimeout(

        () => events.emit("REMOVE_ENNEMY", this), 1000
      )
    }
  }
}
