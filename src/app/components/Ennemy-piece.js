import events from 'app/utils/event-emitter';
import Piece from 'app/components/Piece';
import { piecesColors } from 'app/utils/map-generator';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position) {

    super(pieceName, position, piecesColors[1], "ennemy");

    this.sprite.addEventListener("click", () =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  removeSprite() {
    this.container.removeChild(this.sprite);
  }
}
