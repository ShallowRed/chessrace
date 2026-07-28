import events from 'app/game-events/event-emitter';

import Piece from 'app/game-objects/pieces/piece-sprite';

import type { PieceColor, PiecePlacement } from 'app/types';

export default class EnemyPiece extends Piece {

  constructor(color: PieceColor, { position, pieceName }: PiecePlacement) {

    super({ color, position, pieceName, type: "enemy" });

    this.onClick(() => {

      events.emit("ENEMY_CLICKED", this);
    });
  }

  override render(): void {

    super.render();

    this.setAbsolutePosition();
  }

  setAbsolutePosition(): void {

    (this.container as Piece).style = this.offset;
  }
}
