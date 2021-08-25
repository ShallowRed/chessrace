import Piece from 'app/components/Pieces/Piece';
import { startPiece, startPos, piecesColors } from "app/config";

export default class Player extends Piece {

  constructor() {
    super({
      pieceName: startPiece,
      position: startPos,
      color: piecesColors[0],
      className: "player"
    });
  }

  reset() {
    this.updatePiece(startPiece.slice());
    this.updatePosition([...startPos]);
    this.moveSprite(0);
  }

  updatePiece(pieceName) {
    this.pieceName = pieceName;
    this.setSpriteClassName();
  }

  moveSprite(duration = 0.3) {

    const { left, bottom } = this.getOffset();

    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translate(${left}px, ${-bottom}px)`;
  }

  fall() {
    this.sprite.style.transitionDuration = 0.6;
    this.sprite.style.transform += ` scale(0) rotate(180deg)`;
  }
}
