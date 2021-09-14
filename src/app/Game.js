import events from 'app/models/events';
import GameEvents from 'app/events/';
import LevelModel from 'app/models/level';

import GameObject from 'app/components/Game-object';
import Ennemies from 'app/models/Ennemies';
import Board from 'app/components/board/Board';
import Player from 'app/components/pieces/Player-piece';

import { getBoundMethods } from 'app/utils/bind-methods';

export default {

  init(levelConfig, levelBlueprint) {

    Object.assign(this, levelConfig);

    const { columns, rows, visibleRows } = this;

    this.model = new LevelModel(levelBlueprint, columns, rows, visibleRows);

    this.ennemies = new Ennemies(this.piecesColors[1]);

    this.board = new Board(columns, visibleRows);

    this.setDimensions();

    this.render();

    this.player = new Player(this.piecesColors[0], this.playerStart);

    getBoundMethods.call(this, GameEvents, events.listen); 

    window.addEventListener("resize", () => this.resize());
  },

  setDimensions() {

    GameObject.setDimensions(this.columns, this.visibleRows);

    this.board.setDimensions();
  },

  render() {

    if (this.board.nRenders) {

      this.board.clear();
    }

    this.model.parse();

    this.board.render(this.model);

    if (this.model.newEnnemyPieces.length) {

      this.ennemies.addEach(this.model.newEnnemyPieces);
    }
  },

  reset() {

    this.board.nRenders = 0;

    events.emit("TRANSLATE_BOARD");
    events.emit("TRANSLATE_PIECES");

    this.board.clear();
    this.model.reset();
    this.ennemies.empty();

    this.player.init(this.playerStart);

    this.render();
  },

  resize() {

    this.setDimensions();

    this.board.render(this.model, { resize: true });

    this.player.moveSprite({ duration: 0 });

    this.ennemies.setEachPosition();

    events.emit("SET_EACH_PIECE", piece =>
      piece.setSpriteDimensions()
    );
  }
}
