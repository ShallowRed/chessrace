import events from 'app/models/events';

export function SQUARE_CLICKED(square) {

  events.emit("CHECK_MOVE", square)
    .then(() => events.emit("CHECK_TRAJECTORY", square)
      .then(() => events.emit("MOVE_PLAYER", square))
    )
}

export function ENNEMY_CLICKED(ennemy) {

  events.emit("CHECK_TAKE", ennemy.position)
    .then(() => events.emit("CHECK_TRAJECTORY", ennemy.position)
      .then(() => events.emit("EAT_PIECE", ennemy))
    )
}
