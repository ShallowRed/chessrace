import GameObject from 'app/components/Game-object';
import { squareSize, shadowShift } from "app/config";

export default class Piece extends GameObject {

  constructor(props) {

    super({
      sprite: document.createElement('div')
    });

    this.assign(props);
    this.setSpriteDimensions();
    this.setSpriteClassName();
  }

  setSpriteDimensions() {
    this.sprite.style.width =
      this.sprite.style.height =
      `${squareSize}px`;
  }

  setSpriteClassName() {
    this.sprite.className =
      `piece ${this.pieceName} ${this.color} ${this.className}`;
  }

  removeSprite() {
    this.container.removeChild(this.sprite);
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

  getOffset() {
    const [x, y] = this.position;

    return {
      left: x * squareSize,
      bottom: (y + GameObject.skippedRows) * squareSize + shadowShift
    }
  }
}
