import GameObject from 'app/components/Game-object';

export default class Piece extends GameObject {

  constructor({ pieceName, position, color, className}) {

    super({
      className,
      domEl: { sprite: document.createElement('div') },
      inContainer: true
    })

    Object.assign(this, { pieceName, position, color, className });

    this.setSpriteDimensions();

    this.setSpriteClassName();
  }

  setSpriteDimensions() {

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

    const { size, depth } = GameObject;

    return {
      left: x * size,
      bottom: (y + 1) * size + depth
    }
  }

  fall(duration) {

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform +=
      "translate(15px, 15px) scale(0) rotate(180deg)";
  }
}
