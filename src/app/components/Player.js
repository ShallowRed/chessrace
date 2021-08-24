import Piece from 'app/components/Piece';
import { piecesColors } from 'app/utils/map-generator';

export default class Player extends Piece {

  constructor(pieceName, position) {
    super(pieceName, position, piecesColors[0], "player");
  }

  reset({ startPiece, startPos }) {
    this.resetTranslation();
    this.updatePiece(startPiece.slice());
    this.move([...startPos], 0);
  }

  updatePiece(pieceName) {
    this.pieceName = pieceName;
    this.sprite.style.transitionDuration = 0;
    this.setSpriteClassName();
  }

  fall(gameIsOn) {
    const centerSquare = gameIsOn ? `translateY(-${this.squareSize / 2}px)` : "";
    this.sprite.style.transitionDuration = 0.6;
    this.sprite.style.transform += `${centerSquare} scale(0) rotate(180deg)`;
  }
}
