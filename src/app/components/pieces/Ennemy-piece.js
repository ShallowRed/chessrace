import events from 'app/models/events';
import Piece from 'app/components/pieces/Piece';
import GameObject from 'app/components/Game-object';

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

  getOffset(skippedRows) {
    const [x, y] = this.position;
    const { size, leftOffset, shadowShift } = GameObject;

    return {
      left: x * size + leftOffset,
      bottom: (y + skippedRows + 1) * size + shadowShift
    }
  }

  decrementPositionY() {

    super.decrementPositionY();

    if (this.isBeyondLimit()) {

      events.emit("ENNEMY_FALL", this)
    }
  }
}
