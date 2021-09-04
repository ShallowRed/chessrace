import events from 'app/utils/event-emitter';
import Piece from 'app/components/pieces/Piece';
import GameObject from 'app/components/Game-object';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position, color, skippedRows) {

    super({
      position,
      pieceName,
      color,
      className: "ennemy",
      isInContainer: true
    });

    this.setAbsolutePosition(skippedRows);

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  setAbsolutePosition(skippedRows) {

    const { left, bottom } = this.getOffset(skippedRows);

    this.container.domEl.style.left = `${left}px`;
    this.container.domEl.style.bottom = `${bottom}px`;
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
      this.fall();
      setTimeout(

        () => events.emit("REMOVE_ENNEMY", this), 1000
      )
    }
  }
}
