import * as gameStateEvents from 'app/events/set-game-state';
import * as scrollBoardEvents from 'app/events/scroll-board';
import * as updatePiecesEvents from 'app/events/update-pieces';
import * as userInputsEvents from 'app/events/validate-user-inputs';
import * as validateMovesEvents from 'app/events/validate-moves';

export default { 
  gameStateEvents,
  scrollBoardEvents,
  updatePiecesEvents,
  userInputsEvents,
  validateMovesEvents
};
