import { animationTimeout } from 'app/utils/animation-timeout';

import type { TranslateOptions } from 'app/game-objects/game-object';
import type EnemyPiece from 'app/game-objects/pieces/enemy-sprite';
import type Piece from 'app/game-objects/pieces/piece-sprite';
import type { Coords } from 'app/types';

export interface GameEventMap {
  GAME_ON: [];
  GAME_OVER: [];
  GAME_WON: [];
  SCROLL_ONE_SQUARE_DOWN: [];
  INIT_NEXT_SCROLL_STEP: [];
  TRANSLATE_BOARD: [TranslateOptions?];
  TRANSLATE_PIECES: [TranslateOptions?];
  MOVE_PLAYER: [Coords];
  EAT_PIECE: [EnemyPiece];
  KILL_OFFBOARD_PIECES: [Piece[]];
  CANVAS_CLICKED: [MouseEvent];
  ENEMY_CLICKED: [EnemyPiece];
  IS_ALLOWED_MOVING: [];
  IS_VALID_TRAJECTORY: [Coords];
}

export type EventName = keyof GameEventMap;

export type EventListener<K extends EventName> =
  (...args: GameEventMap[K]) => unknown;

type SilentEvent = {
  [K in EventName]: GameEventMap[K] extends [] ? K : never
}[EventName];

type StoredListener = (...args: never[]) => unknown;

export default new class Events {

  private listeners: Partial<Record<EventName, StoredListener[]>> = {};

  on = <K extends EventName>(message: K, listener: EventListener<K>): void => {

    this.register(message, listener);
  }

  // The door for registration driven by data rather than by a literal event
  // name, where the tie between the two cannot be kept.
  register(message: EventName, listener: StoredListener): void {

    const listeners = (this.listeners[message] ??= []);

    listeners.push(listener);
  }

  emit<K extends EventName>(message: K, ...args: GameEventMap[K]): void {

    for (const listener of this.listenersOf(message)) {

      listener(...args);
    }
  }

  get<K extends EventName>(message: K, ...args: GameEventMap[K]): unknown[] {

    return this.listenersOf(message)
      .map(listener => listener(...args));
  }

  ask<K extends EventName>(message: K, ...args: GameEventMap[K]): boolean {

    const results = this.get(message, ...args);

    const validResults = results.filter(Boolean);

    return results.length === validResults.length;
  }

  reset(): void {

    this.listeners = {};
  }

  timeout(message: SilentEvent, delay: number): void {

    animationTimeout(() =>
      this.emit(message),
      delay
    );
  }

  private listenersOf<K extends EventName>(message: K): EventListener<K>[] {

    return (this.listeners[message] ?? []) as EventListener<K>[];
  }

}();
