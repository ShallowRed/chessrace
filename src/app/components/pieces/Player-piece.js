import Piece from 'app/components/pieces/Piece';
import GameObject from 'app/components/Game-object';

export default class Player extends Piece {

  constructor(startPiece, startPos, color) {

    super({
      pieceName: startPiece.slice(),
      position: [...startPos],
      color,
      className: "player",
      isInContainer: true
    });

    this.container.setStyle({
      left: GameObject.leftOffset,
      bottom: GameObject.shadowShift + GameObject.size,
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

  moveSprite({ duration }, skippedRows) {

    const { left, top } = this.getOffset(skippedRows);

    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translate(${left}px, ${top}px)`;
  }

  getOffset(skippedRows = 0) {
    
    const [x, y] = this.position;

    return {
      left: x * GameObject.size,
      top:  -(y + skippedRows) * GameObject.size
    }
  }
}
