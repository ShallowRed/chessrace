import GameObject from 'app/components/Game-object';

export default class Piece extends GameObject {

  constructor({ pieceName, position, color, className }) {

    super({
      sprite: document.createElement('div')
    });

    this.assign({ pieceName, position, color, className });
    this.setSpriteDimensions();
    this.setSpriteClassName();
  }

  setSpriteDimensions() {
    this.sprite.style.width =
      this.sprite.style.height =
      `${GameObject.size}px`;
  }

  setSpriteClassName() {
    this.sprite.className =
      `piece ${this.pieceName} ${this.color} ${this.className}`;
  }

  removeSprite() {
    GameObject.container.removeChild(this.sprite);
  }

  updatePiece(pieceName) {
    this.pieceName = pieceName;
    this.setSpriteClassName();
  }

  updatePosition(position) {
    this.position = position;
  }

  decrementPositionY() {
    this.position[1]--;
  }

  isBeyondLimit() {
    return this.position[1] < 0;
  }

  getOffset(skippedRows) {
    const [x, y] = this.position;
    const { size, left, shadowShift } = GameObject;

    return {
      left: x * size + left,
      bottom: (y + skippedRows + 1) * size + shadowShift
    }
  }

  fall() {
    this.sprite.style.transitionDuration = '1s';
    this.sprite.style.transform += `translate(15px, 15px) scale(0) rotate(180deg) `;
  }
}
