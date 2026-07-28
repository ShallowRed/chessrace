import * as gameState from 'app/game-events/set-game-state';
import * as scrollBoard from 'app/game-events/scroll-board';
import * as updatePieces from 'app/game-events/update-pieces';
import * as validateMoves from 'app/game-events/validate-moves';

import type { EventName, GameEventMap } from 'app/game-events/event-emitter';
import type Game from 'app/game';

export type Handler<K extends EventName> =
  (this: Game, ...args: GameEventMap[K]) => unknown;

// Every event needs a handler and every handler needs a matching event: a
// name that drifts on either side stops compiling instead of going quiet.
export const handlers: { [K in EventName]: Handler<K> } = {
  ...gameState,
  ...scrollBoard,
  ...updatePieces,
  ...validateMoves
};
