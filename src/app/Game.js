import events from 'app/game-events/event-emitter';

import GameEvents from 'app/game-events/';
import LevelModel from 'app/level/level';

import EnnemiesCollection from 'app/game-objects/pieces//models/ennemies-collection';
import Board from 'app/game-objects/board/board';
import Player from 'app/game-objects/pieces/player-sprite';

import { getBoundMethods } from 'app/utils/bind-methods';
import { getRandomPiecesColor } from 'app/utils/get-random-pieces-color';

import { test } from "app/utils/test";

export default {

  init({
    board: { columns, rows, visibleRows },
    playerSpawn,
    durations,
    blueprint
  }) {

    this.durations = durations;

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

  get pieces() {

    return [this.player, ...this.ennemies.collection];
  },

  get offBoardPieces() {

    const boardLimit = this.board.nRenders - 1;

    return this.pieces.filter(({ position }) => {

      return position[1] < boardLimit
    })
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

    events.emit("TRANSLATE_BOARD");

    events.emit("TRANSLATE_PIECES");

    this.board.nRenders = 0;

    this.board.clear();

    this.ennemies.removeAll();

    this.model.reset();

    this.player.reset();
  },

  resize() {

    this.board.setDimensions();

    this.board.render(this.model);

    for (const piece of this.pieces) {

      piece.setSpriteSize();
    }

    this.player.moveSprite();

    this.ennemies.setEachPosition();
  }
}
