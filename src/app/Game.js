import * as gameStateEvents from 'app/events/set-game-state';
import * as scrollBoardEvents from 'app/events/scroll-board';
import * as updatePiecesEvents from 'app/events/update-pieces';
import * as userInputsEvents from 'app/events/validate-user-inputs';
import * as validateMovesEvents from 'app/events/validate-moves';

import events from 'app/models/events';
import Level from 'app/models/level';

import GameObject from 'app/components/Game-object';
import Ennemies from 'app/models/Ennemies';
import Board from 'app/components/board/Board';
import Player from 'app/components/pieces/Player-piece';

import { getEachBoundMethods } from 'app/utils/bind-methods';

export default {

  skippedRows: 0,

  events: [
    gameStateEvents,
    scrollBoardEvents,
    updatePiecesEvents,
    userInputsEvents,
    validateMovesEvents
  ],

  init(levelConfig, levelBlueprint) {

    Object.assign(this, levelConfig);

    const { columns, rows, visibleRows } = this;

    this.model = new Level(levelBlueprint, columns, rows, visibleRows);
    this.ennemies = new Ennemies(this.piecesColors[1]);

    this.board = new Board(columns, visibleRows);
    this.setDimensions();
    this.player = new Player(this.piecesColors[0], this.playerStart);

    this.render();

    getEachBoundMethods.call(this, this.events, events.listen);

    window.addEventListener("resize", () => this.resize());
  },

  setDimensions() {
    GameObject.setDimensions(this.columns, this.visibleRows);
    this.board.setDimensions();
  },

  render() {

    const { board, model, ennemies } = this;

    if (board.nRenders) {
      board.clear();
    }

    model.parse(board.nRenders);
    board.render(model);

    if (model.newEnnemyPieces.length) {
      ennemies.addEach(model.newEnnemyPieces);
    }

    if (board.nRenders > 1) {
      this.skippedRows++;
    }
  },

  reset() {

    const { board, model, ennemies, player } = this;

    this.skippedRows = 0;
    board.nRenders = 0;

    events.emit("TRANSLATE_BOARD");
    events.emit("TRANSLATE_PIECES");

    board.clear();
    model.reset();
    ennemies.empty();
    player.init(this.playerStart);
    this.render();
  },

  resize() {

    this.setDimensions();

    this.board.nRenders--;
    this.board.render(this.model);

    this.player.moveSprite({ duration: 0 });

    this.ennemies.setEachPosition();

    events.emit("SET_EACH_PIECE", piece =>
      piece.setSpriteDimensions()
    );
  }
}
