import events from 'app/game-events/event-emitter';

export function GAME_ON() {

  this.on = true;

  events.emit("SCROLL_ONE_SQUARE_DOWN");
}

export function GAME_OVER() {

  this.on = false;

  this.reset();

  this.render();

  setTimeout(() =>
    alert("Game Over"),
    100
  );
}

export function GAME_WON() {

  this.on = false;

  this.reset();
  
  this.render();

  setTimeout(() =>
    alert("Game won"),
    500
  );
}
