import Piece from 'app/components/pieces/Piece';

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

  init() {
    this.updatePiece(this.startPiece.slice());
    this.updatePosition([...this.startPos]);
    this.moveSprite({ duration: 0 });
  }

  moveSprite({ duration }, skippedRows = 0) {

    const { left, bottom } = this.getOffset(skippedRows);

    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translate(${left}px, ${-bottom}px)`;
  }
}
