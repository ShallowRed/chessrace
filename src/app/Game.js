import * as GameEvents from 'app/game-events';
import GameObject from 'app/components/Game-object';
import Ennemies from 'app/components/pieces/Ennemies';
import LevelModel from 'app/level-model';
import Board from 'app/components/board/Board';
import Player from 'app/components/pieces/Player-piece';
import events from 'app/utils/event-emitter';
import { getBoundMethods, getRandomPiecesColor } from 'app/utils/utils';

export default {

  rows: 8,

  // startPos: [4, 2],
  startPos: [2, 0],
  startPiece: "queen",

  translationDuration: 2,
  spriteSpeed: 0.3,

  piecesColors: getRandomPiecesColor(),

  init(levelBlueprint) {

    this.columns = levelBlueprint.columns;

    const { rows, columns, piecesColors, startPos, startPiece } = this;

    GameObject.setsize(columns, rows);

    this.model = new LevelModel(levelBlueprint, rows);

    this.board = new Board(columns, rows);
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

    GameObject.resetTranslation();
    board.reset();
    model.reset();
    ennemies.empty();
    player.init();

    this.render();
  },
}

window.addEventListener("resize", () => {
  events.emit("RESIZE")
});

document.addEventListener('keydown', event => {
  events.emit("KEYDOWN", event.code)
})
