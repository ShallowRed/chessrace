import Piece from 'app/components/pieces/Piece';

import { animationTimeout } from 'app/utils/animation-timeout';

export default class Player extends Piece {

  constructor(props) {

    super({ ...props, className: "player" });

    this.moveSprite();
  }

  init({ pieceName, position }) {

    this.updatePiece(pieceName);

    this.updatePosition(position);

    this.moveSprite();
  }

  moveSprite({ duration = 0 } = {}) {

    const { left, bottom } = this.getOffset();

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform = `translate(${left}px, -${bottom}px)`;

    this.isMoving = true;

    animationTimeout(() => {
      this.isMoving = false;
    }, duration)
  }
}
