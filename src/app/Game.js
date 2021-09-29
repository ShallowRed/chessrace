import events from 'app/game-events/event-emitter';

import GameEvents from 'app/game-events/';
import LevelModel from 'app/level/level';

import EnnemiesCollection from 'app/game-objects/pieces//models/ennemies-collection';
import Board from 'app/game-objects/board/board';
import Player from 'app/game-objects/pieces/player-sprite';

import { getBoundMethods } from 'app/utils/bind-methods';
import { getRandomPiecesColor } from 'app/utils/get-random-pieces-color';

export default {

  init({
    board: { columns, rows, visibleRows },
    playerSpawn,
    durations,
    blueprint
  }) {


    Object.assign(this, { columns, rows, visibleRows, durations });


    this.model = new LevelModel(blueprint, { columns, rows, visibleRows });

    this.board = new Board({ columns, rows: visibleRows });


    const [playerColor, ennemiesColor] = getRandomPiecesColor();

    this.player = new Player(playerColor, playerSpawn);

    this.ennemies = new EnnemiesCollection(ennemiesColor);


    this.board.setDimensions();

    this.render();

    this.player.render();

    this.addListeners();
  },

  addListeners() {

    getBoundMethods.call(this, GameEvents, (message, listener) => {

      events.on(message, listener);
    });

    window.addEventListener("resize", () => this.resize());
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

    this.board.setDimensions();

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
