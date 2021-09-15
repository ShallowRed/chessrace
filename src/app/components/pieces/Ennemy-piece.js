import events from 'app/models/events';
import Piece from 'app/components/pieces/Piece';

export default class EnnemyPiece extends Piece {

  constructor(props) {

    super({ ...props, className: "ennemy" });

    this.setAbsolutePosition();

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  setAbsolutePosition() {

    const offset = this.getOffset();

    this.container.setStyle(offset);
  }
}
