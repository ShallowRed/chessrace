import events from 'app/game-events/event-emitter';

import Piece from 'app/game-objects/pieces/piece-sprite';

import { animationTimeout } from 'app/utils/animation-timeout';

export default class Player extends Piece {

  constructor(color, { position, pieceName }) {

    super({ color, position, pieceName, className: "player" });

    this.spawn = { position, pieceName };
  }

  render() {

    super.render();

    this.moveSprite();
  }

  reset() {

    const { pieceName, position } = this.spawn;

    this.updatePiece(pieceName);

    this.updatePosition(position);

    this.moveSprite();
  }

  moveSprite({ duration = 0 } = {}) {

    const { left, bottom } = this.getOffset();

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform = `translate(${left}px, -${bottom}px)`;

    this.setFlag("isMoving", duration)
  }

  fall(duration) {

    super.fall(duration);

    this.setFlag("isFalling", duration);

    events.timeout("GAME_OVER", duration);
  }

  setFlag(flag, duration) {

    this[flag] = true;

    animationTimeout(() => {

      this[flag] = false;

    }, duration)
  }
}
