import events from 'app/models/events';
import Piece from 'app/components/pieces/Piece';

export default class EnnemyPiece extends Piece {

  constructor(props) {

    super({ ...props, className: "ennemy", zIndex: 80 });

    this.setAbsolutePosition();

    this.setZIndex();

    this.onClick(() => {

      if (events.ask("IS_VALID_TAKE", this.position)) {

        events.emit("EAT_PIECE", this);
      }
    });
  }

  setAbsolutePosition() {

    const offset = this.getOffset();

    this.container.setStyle(offset);
  }
}
