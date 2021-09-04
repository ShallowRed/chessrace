import Piece from 'app/components/pieces/Piece';
import GameObject from 'app/components/Game-object';

export default class Player extends Piece {

  constructor(color, playerStart) {

    super({
      pieceName: playerStart.pieceName.slice(),
      position: [...playerStart.position],
      color,
      className: "player"
    });

    this.container.setStyle({
      left: GameObject.leftOffset,
      bottom: GameObject.shadowShift + GameObject.size,
    });

    this.moveSprite({ duration: 0 });
  }

  init(playerStart) {
    this.updatePiece(playerStart.pieceName.slice());
    this.updatePosition([...playerStart.position]);
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
      top: -(y + skippedRows) * GameObject.size
    }
  }
}
