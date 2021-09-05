import events from 'app/models/events';
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

    this.container.setStyle({ left, bottom });
  }

  decrementPositionY() {

    super.decrementPositionY();

    if (this.position[1] < 0) {

      events.emit("ENNEMY_FALL", this)
    }
  }
}
