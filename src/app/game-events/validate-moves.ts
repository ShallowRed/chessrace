import events from 'app/game-events/event-emitter';

import { animationTimeout } from 'app/utils/animation-timeout';

import type Game from 'app/game';
import type EnemyPiece from 'app/game-objects/pieces/enemy';
import type { Outcome } from 'app/level/rules';
import type { Coords } from 'app/types';

export function CANVAS_CLICKED(this: Game, evt: MouseEvent): void {

  events.emit("PLAY_MOVE", this.board.getSquare.clicked(evt));
}

export function ENEMY_CLICKED(this: Game, enemy: EnemyPiece): void {

  events.emit("PLAY_MOVE", enemy.position);
}

// One click, one answer, and the same answer the solver gets.
export function PLAY_MOVE(this: Game, target: Coords): void {

  if (!events.ask("IS_ALLOWED_MOVING")) return;

  act.call(this, this.model.resolve(this.player, target));
}

function act(this: Game, outcome: Outcome): void {

  if (outcome.kind === "illegal") return;

  if (outcome.kind === "move") return events.emit("MOVE_PLAYER", outcome.to);

  if (outcome.kind === "capture") {

    const enemy = this.enemies.at(outcome.to);

    return enemy
      ? events.emit("EAT_PIECE", enemy)
      : events.emit("MOVE_PLAYER", outcome.to);
  }

  events.emit("MOVE_PLAYER", outcome.at);

  animationTimeout(() => {
    this.player.fall(this.durations.fall)
  }, this.durations.move);
}

export function IS_ALLOWED_MOVING(this: Game): boolean {

  return (
    !this.player.isMoving &&
    !this.player.isFalling
  )
}
