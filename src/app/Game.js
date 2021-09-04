import * as GameEvents from 'app/game-events';
import GameObject from 'app/components/Game-object';
import Ennemies from 'app/components/pieces/Ennemies';
import LevelModel from 'app/level-model';
import Board from 'app/components/board/Board';
import Player from 'app/components/pieces/Player-piece';
import events from 'app/utils/event-emitter';
import { getBoundMethods } from 'app/utils/utils';

export default {

  init(levelConfig, levelBlueprint) {

    Object.assign(this, levelConfig);

    const { columns, rows, visibleRows, piecesColors, startPos, startPiece } = this;

    GameObject.setSize(columns, visibleRows);

    this.model = new LevelModel(levelBlueprint, columns, rows, visibleRows);

    this.board = new Board(columns, visibleRows);
    this.ennemies = new Ennemies(piecesColors[1]);
    this.player = new Player(startPiece, startPos, piecesColors[0]);

    this.render();

    getBoundMethods.call(this, GameEvents, events.on);
  },

  render() {

    const { board, model, ennemies } = this;

    if (board.nRenders) {
      board.clear();
    }

    model.parse();
    board.render(model);

    if (model.newEnnemyPieces.length) {
      ennemies.addEach(model.newEnnemyPieces, model.skippedRows);
    }

    if (board.nRenders > 1) {
      model.skippedRows++;
    }
  },

  reset() {
    
    const { board, model, ennemies, player } = this;

    board.nRenders = 0;

    events.emit("TRANSLATE_BOARD");
    events.emit("TRANSLATE_PIECES");

    board.clear();
    model.reset();
    ennemies.empty();
    player.init();

    this.render();
  },
}

window.addEventListener("resize", () => {
  events.emit("RESIZE")
});
