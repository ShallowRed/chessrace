import Piece from 'app/components/Piece';
import { startPiece, startPos, piecesColors } from "app/config";

export default class Player extends Piece {

  constructor() {
    super({
      color: piecesColors[0],
      className: "player"
    });

  }

  reset() {
    this.updatePiece(startPiece.slice());
    this.updatePosition([...startPos]);
  }

  moveSprite(duration = 0.3) {

    const { left, bottom } = this.getOffset();

    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translate(${left}px, ${-bottom}px)`;
  }

  fall() {
    this.sprite.style.transitionDuration = '1s';
    this.sprite.style.transform += ` scale(0) rotate(180deg)`;
  }
}
