import GameObject from 'app/game-objects/game-object';
import PlayArea from 'app/game-objects/board/models/play-area';

export default class Piece extends GameObject {

  constructor({ className, ...props }) {

    super({
      className,
      domEl: { sprite: document.createElement('div') },
      inContainer: true
    })

    Object.assign(this, { className, ...props });
  }

  render() {

    this.setSpriteSize();

    this.setSpriteClassName();
  }

  setSpriteSize() {

    this.setStyle({
      width: PlayArea.squareSize,
      height: PlayArea.squareSize
    });
  }

  setSpriteClassName() {

    this.sprite.className =
      `piece ${this.pieceName} ${this.color} ${this.className}`;
  }

  removeSprite() {

    GameObject.container.removeChild(this.container.domEl);
  }

  updatePiece(pieceName) {

    this.pieceName = pieceName;

    this.setSpriteClassName();
  }

  updatePosition(position) {

    this.position = position;
  }

  getOffset() {

    const [x, y] = this.position;

    const { squareSize, offset } = PlayArea;

    return {
      left: x * squareSize + offset.left,
      bottom: (y + 1) * squareSize
    }
  }

  fall(duration) {

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform +=
      "translate(15px, 15px) scale(0) rotate(180deg)";
  }
}