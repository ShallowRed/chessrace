import GameObject from 'app/components/Game-object';

export default class Piece extends GameObject {

  constructor({ className, ...props}) {

    super({
      className,
      domEl: { sprite: document.createElement('div') },
      inContainer: true
    })

    Object.assign(this, { className, ...props});

    this.setSpriteSize();

    this.setSpriteClassName();
  }

  setSpriteSize() {

    this.setStyle({
      width: GameObject.size,
      height: GameObject.size
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

    return {
      left: x * GameObject.size,
      bottom: (y + 1) * GameObject.size + GameObject.depth
    }
  }

  fall(duration) {

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform +=
      "translate(15px, 15px) scale(0) rotate(180deg)";
  }
}
