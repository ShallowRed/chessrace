import events from 'app/game-events/event-emitter';

import Piece from 'app/game-objects/pieces/piece-sprite';

export default class Player extends Piece {

  isPlayer = true;

  constructor(color, { position, pieceName }) {

    super({ color, position, pieceName, type: "player" });

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

    setTimeout(() => {

      this[flag] = false;

    }, duration)
  }
}
