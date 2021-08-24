import Piece from 'app/components/Piece';

export default class Player extends Piece {

  constructor(pieceName, position) {
    super(pieceName, position, "white", "player");
  }

  reset({ startPiece, startPos }) {
    this.updatePiece(startPiece.slice());
    this.updatePosition([...startPos]);
    this.translateY();
    this.move(0);
  }

  updatePiece(pieceName) {
    this.pieceName = pieceName;
    this.sprite.className = `player piece ${pieceName} white`;
  }

  updatePosition(position) {
    this.position = position;
  }

  moveToSquare(square) {
    this.updatePosition(square);
    this.move();
  }

  fall(gameIsOn) {
    const centerSquare = gameIsOn ? `translateY(-${this.size / 2}px)` : "";
    this.sprite.style.transitionDuration = 0.6;
    this.sprite.style.transform += `${centerSquare} scale(0) rotate(180deg)`;
  }
}
