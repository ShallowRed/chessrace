import Piece from 'app/components/pieces/Piece';

export default class Player extends Piece {

  constructor(color, playerStart) {

    super({
      pieceName: playerStart.pieceName.slice(),
      position: [...playerStart.position],
      color,
      className: "player"
    });

    this.moveSprite({ duration: 0 });
  }

  init(playerStart) {
    this.updatePiece(playerStart.pieceName.slice());
    this.updatePosition([...playerStart.position]);
    this.moveSprite({ duration: 0 });
  }

  moveSprite({ duration }, skippedRows) {

    const { left, bottom } = this.getOffset(skippedRows);

    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translate(${left}px, -${bottom}px)`;
  }
}
