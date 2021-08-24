import GameObject from 'app/components/Game-object';

export default class Piece extends GameObject {

  constructor(pieceName, position, color, className = "") {

    super("sprite");

    this.pieceName = pieceName;
    this.className = className;
    this.color = color;

    this.createSprite();
    this.setSpriteClassName();
    this.move(position);
  }

  createSprite() {
    this.sprite = document.createElement("div");
    this.container.append(this.sprite);
    this.sprite.style.width =
      this.sprite.style.height =
      `${this.squareSize}px`;
  }

  setSpriteClassName() {
    this.sprite.className =
      `piece ${this.pieceName} ${this.color} ${this.className}`;
  }

  move(position, duration = 0.3) {

    this.position = position;

    const [left, bottom] = this.position.map(coord =>
      (coord - 1) * this.squareSize
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
    this.move(this.position, 0);
  }
}
