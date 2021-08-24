import Piece from 'app/components/Piece';
import { squareSize, startPiece, startPos, piecesColors } from "app/config";

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
    this.resetTranslation();
    this.updatePiece(startPiece.slice());
    this.moveSprite([...startPos], 0);
  }

  updatePiece(pieceName) {
    this.pieceName = pieceName;
    this.sprite.style.transitionDuration = 0;
    this.setSpriteClassName();
  }

  fall(gameIsOn) {
    const centerSquare = gameIsOn ? `translateY(-${squareSize / 2}px)` : "";
    this.sprite.style.transitionDuration = 0.6;
    this.sprite.style.transform += `${centerSquare} scale(0) rotate(180deg)`;
  }
}
