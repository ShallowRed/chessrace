import GameObject from 'app/game-objects/game-object';
import PlayArea from 'app/game-objects/board/models/play-area';

export default class Piece extends GameObject {

  constructor(props) {

    super({
      className: props.type,
      domEl: { sprite: document.createElement('div') },
      inContainer: true
    });

    Object.assign(this, props);
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
      `piece ${this.type} ${this.color} ${this.pieceName}`;
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

    const [col, row] = this.position;

    const { squareSize, offset } = PlayArea;

    return {
      left: col * squareSize + offset.left,
      bottom: (row + 1) * squareSize
    }
  }

  fall(duration) {

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform +=
      "translate(15px, 15px) scale(0) rotate(180deg)";
  }
}
