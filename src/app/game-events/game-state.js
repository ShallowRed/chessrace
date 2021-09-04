import events from 'app/utils/event-emitter';

export function START_GAME() {

  this.on = true;

  setTimeout(() =>
    events.emit("SCROLL_ONE_SQUARE_DOWN"),
    10
  );
}

export function GAME_OVER() {

  this.on = false;
  this.reset();

  setTimeout(() =>
    alert("Game Over"),
    100
  );
}

export function GAME_WON() {

  this.on = false;
  this.reset();

  setTimeout(() => {
      alert("Game won");
    },
    500
  );
}
