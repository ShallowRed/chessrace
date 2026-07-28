import events from 'app/game-events/event-emitter';

import { beforeTheEndOf } from 'app/utils/timing';

import type Game from 'app/game';
import type EnemyPiece from 'app/game-objects/pieces/enemy-sprite';
import type Piece from 'app/game-objects/pieces/piece-sprite';
import type { Coords } from 'app/types';

export function MOVE_PLAYER(this: Game, position: Coords): void {

  if (!this.on) {

    events.emit("GAME_ON");
  }

  this.moves++;

  this.player.position = position;

  this.player.moveSprite({ duration: this.durations.move });

  if (this.player.position[1] === this.model.rows) {

    events.timeout("GAME_WON", this.durations.move * 2);
  }
}

export function EAT_PIECE(this: Game, enemy: EnemyPiece): void {

  events.emit("MOVE_PLAYER", enemy.position);

  this.player.piece = enemy.piece;

  setTimeout(() => {

    this.enemies.remove(enemy);

  }, beforeTheEndOf(this.durations.move));
}

export function KILL_OFFBOARD_PIECES(this: Game, offBoardPieces: Piece[]): void {

  if (!offBoardPieces.length) return;

  for (const piece of offBoardPieces) {

    piece.fall(this.durations.fall);
  }

  setTimeout(() => {

    this.enemies.removeEach(offBoardPieces.filter(isEnemy) as EnemyPiece[]);

  }, beforeTheEndOf(this.durations.fall));
}

function isEnemy(piece: Piece): boolean { return !piece.isPlayer }
