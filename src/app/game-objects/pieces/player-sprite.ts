import events from 'app/game-events/event-emitter';

import Piece from 'app/game-objects/pieces/piece-sprite';

import { ms } from 'app/utils/timing';

import type { PieceColor, PiecePlacement } from 'app/types';

type PieceFlag = "isMoving" | "isFalling";

export default class Player extends Piece {

  override isPlayer = true;

  spawn: PiecePlacement;

  constructor(color: PieceColor, { position, pieceName }: PiecePlacement) {

    super({ color, position, pieceName, type: "player" });

    this.spawn = { position, pieceName };
  }

  override render(): void {

    super.render();

    this.moveSprite();
  }

  reset(): void {

    const { pieceName, position } = this.spawn;

    this.piece = pieceName;

    this.position = position;

    this.moveSprite();
  }

  moveSprite({ duration = 0 }: { duration?: number } = {}): void {

    const { left, bottom } = this.offset;

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform = `translate(${left}px, -${bottom}px)`;

    this.setFlag("isMoving", duration)
  }

  override fall(duration: number): void {

    super.fall(duration);

    this.setFlag("isFalling", duration);

    events.timeout("GAME_OVER", duration);
  }

  setFlag(flag: PieceFlag, seconds: number): void {

    this[flag] = true;

    setTimeout(() => {

      this[flag] = false;

    }, ms(seconds))
  }
}
