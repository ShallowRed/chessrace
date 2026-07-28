import events from 'app/game-events/event-emitter';

import type Game from 'app/game';

export function GAME_ON(this: Game): void {

  this.on = true;

  events.emit("SCROLL_ONE_SQUARE_DOWN");
}

export function GAME_OVER(this: Game): void {

  this.finish("lost");
}

export function GAME_WON(this: Game): void {

  this.finish("won");
}
