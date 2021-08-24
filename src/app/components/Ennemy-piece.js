import events from 'app/utils/event-emitter';
import Piece from 'app/components/Piece';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position) {

    super(pieceName, position, "black");

    this.sprite.addEventListener("click", () =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  removeSprite() {
    this.container.removeChild(this.sprite);
  }
}
