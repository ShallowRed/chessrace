import events from 'app/models/events';

export function SQUARE_CLICKED(square) {
  events.ask("IS_VALID_MOVE", square) &&
    events.ask("IS_VALID_TRAJECTORY", square) &&
    events.emit("MOVE_PLAYER", square)
}

export function ENNEMY_CLICKED(ennemy) {

  events.ask("IS_VALID_TAKE", ennemy.position) &&
    events.ask("IS_VALID_TRAJECTORY", ennemy.position) &&
    events.emit("EAT_PIECE", ennemy)
}
