import GameObject from 'app/components/Game-object';
import { squareSize, shadowShift } from "app/config";
import { animationTimeout } from 'app/utils/animation-timeout';

export default class Piece extends GameObject {

  constructor(props) {

    super({
      sprite: document.createElement('div')
    });

    this.assign(props);
    this.setSpriteDimensions();
    this.setSpriteClassName();
    this.spawnSprite();
    this.moveSprite(props.position);
  }

  spawnSprite() {
    this.container.append(this.sprite);
  }

  removeSprite() {
    this.container.removeChild(this.sprite);
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

  moveSprite(position, duration = 0.3) {

    this.position = position;

    const [left, bottom] = this.position.map(coord =>
      (coord - 1) * squareSize
    );

    const move = () => {
      this.sprite.style.transitionDuration = `${duration}s`;
      this.sprite.style.left = `${left}px`;
      this.sprite.style.bottom = `${bottom + shadowShift}px`;
    }

    duration === 0 ?
      move() :
      setTimeout(move);
  }

  moveSpriteOneSquareDown() {
    --this.position[1];
    this.moveSprite(this.position, 0);
  }
}
