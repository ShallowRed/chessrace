import events from 'app/utils/event-emitter';
import Piece from 'app/components/Pieces/Piece';
import { piecesColors } from 'app/config';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position, nRenders) {

    super({
      pieceName,
      color: piecesColors[1],
      className: "ennemy"
    });

    this.nRenders = nRenders;

    // weird workaround here, starting from 2nd render,
    // ennemies position y is one square too far
    const newpos = this.nRenders > 1 ? [position[0], position[1] - 1] :
      position;
    //

    this.updatePosition(newpos);

    const { left, bottom } = this.getOffset();

    this.sprite.style.left = `${left}px`;
    this.sprite.style.bottom = `${bottom}px`;

    this.onClick(() =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }
}
