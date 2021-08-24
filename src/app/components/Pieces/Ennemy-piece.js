import events from 'app/utils/event-emitter';
import Piece from 'app/components/Pieces/Piece';
import { piecesColors } from 'app/config';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position) {

    super({
      pieceName,
      position,
      color: piecesColors[1],
      className: "ennemy"
    });

    this.sprite.addEventListener("click", () =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }
}
