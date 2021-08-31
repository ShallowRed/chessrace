import Piece from 'app/components/Piece';

export default class Player extends Piece {

  constructor(startPiece, startPos, color) {

    super({
      pieceName: startPiece.slice(),
      position: [...startPos],
      color,
      className: "player"
    });

    this.startPos = startPos;
    this.startPiece = startPiece;
    this.moveSprite({ duration: 0 });
  }

  reset() {
    this.updatePiece(this.startPiece.slice());
    this.updatePosition([...this.startPos]);
  }

  moveSprite({ duration }) {

    const { left, bottom } = this.getOffset();

    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translate(${left}px, ${-bottom}px)`;
  }

  fall() {
    this.sprite.style.transitionDuration = '1s';
    this.sprite.style.transform += ` scale(0) rotate(180deg)`;
  }
}
