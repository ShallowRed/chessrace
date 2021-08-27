import GameObject from 'app/components/Game-object';

export default class Piece extends GameObject {

  constructor({ pieceName, position, color, className }) {

    super({
      sprite: document.createElement('div')
    });

    Object.assign(this, { pieceName, position, color, className });
    this.setSpriteDimensions();
    this.setSpriteClassName();
  }

  setSpriteDimensions() {
    this.sprite.style.width =
      this.sprite.style.height =
      `${GameObject.squareSize}px`;
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
    // return this.position[1] < 2;
  }

  getOffset() {
    const [x, y] = this.position;
    const { squareSize, shadowShift, skippedRows } = GameObject;

    return {
      left: x * squareSize,
      bottom: (y + skippedRows) * squareSize + shadowShift
    }
  }
}
