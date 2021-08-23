export default class Piece {

  constructor(pieceName, sprite, map) {

    this.pieceName = pieceName;

    this.sprite = sprite;
    this.size = map.squareSize;
    this.shadowShift = map.shadowShift;

    this.sprite.style.width =
      this.sprite.style.height =
      `${this.size}px`;
  }

  move(duration = 0.3) {

    const [left, bottom] = this.position.map(x =>
      (x - 1) * this.size
    );

    const movePiece = () => {
      this.sprite.style.transitionDuration = `${duration}s`;
      this.sprite.style.left = `${left}px`;
      this.sprite.style.bottom = `${bottom + this.shadowShift}px`;
    }

    duration === 0 ?
      movePiece() :
      setTimeout(movePiece);
  }

  translateY(distance = 0, duration = 0) {
    this.sprite.style.transitionDuration = `${duration}s`;
    this.sprite.style.transform = `translateY(${distance}px)`;
  }

  resetTranslation() {
    this.translateY();
  }

  moveOneSquareDown() {
    --this.position[1];
    this.move(0);
  }
}
