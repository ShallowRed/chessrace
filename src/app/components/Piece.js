import GameObject from 'app/components/Game-object';

export default class Piece extends GameObject {

  constructor(pieceName, position, color, className = "") {

    super("sprite");

    this.pieceName = pieceName;
    this.position = position;
    this.move();

    this.sprite = document.createElement("div");
    this.sprite.className = `piece ${pieceName} ${color} ${className}`;
    this.container.append(this.sprite);
    this.sprite.style.width =
      this.sprite.style.height =
      `${this.squareSize}px`;
  }

  move(duration = 0.3) {

    const [left, bottom] = this.position.map(x =>
      (x - 1) * this.squareSize
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

  moveOneSquareDown() {
    --this.position[1];
    this.move(0);
  }
}
