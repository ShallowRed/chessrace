import events from 'app/models/events';
import Piece from 'app/components/pieces/Piece';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position, color) {

    super({
      position,
      pieceName,
      color,
      className: "ennemy"
    });

    this.setAbsolutePosition();

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  setAbsolutePosition() {

    const { left, bottom } = this.getOffset();

    this.container.setStyle({ left, bottom });
  }
}
