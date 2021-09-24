import events from 'app/game-events/event-emitter';
import GameEvents from 'app/game-events/';
import LevelModel from 'app/level/level';

import EnnemiesCollection from 'app/game-objects/pieces//models/ennemies-collection';
import Board from 'app/game-objects/board/board';
import Player from 'app/game-objects/pieces/player-sprite';
import PlayArea from 'app/game-objects/board/models/play-area';

import { getBoundMethods } from 'app/utils/bind-methods';

export default {

  init(levelConfig, levelBlueprint) {

    Object.assign(this, levelConfig);


    const { columns, rows, visibleRows } = this;

    const [color, ennemiesColor] = this.piecesColors;


    this.model = new LevelModel(levelBlueprint, columns, rows, visibleRows);

    this.board = new Board(columns, visibleRows);

    this.ennemies = new EnnemiesCollection(ennemiesColor);

    this.player = new Player(color, this.playerInit);


    this.setDimensions();

    this.render();

    this.player.render();


    getBoundMethods.call(this, GameEvents, (message, listener) => {

      events.on(message, listener);
    });

    window.addEventListener("resize", () => this.resize());
  },

  setDimensions() {

    PlayArea.setDimensions(this.columns, this.visibleRows);

    this.board.setDimensions();

    // this.board.dotest();
  },

  render() {

    if (this.board.nRenders) {

      this.board.clear();
    }

    this.model.parseNextRows();

    this.board.nRenders++;

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

    this.ennemies.empty();

    this.model.init();

    this.player.reset();
  },

  resize() {

    this.setDimensions();

    this.board.render(this.model);

    this.forEachPiece(piece => {

      piece.setSpriteSize();
    });

    this.player.moveSprite();

    this.ennemies.setEachPosition();

  },

  forEachPiece(callback) {

    [this.player, ...this.ennemies.collection].forEach(callback);
  }
}
