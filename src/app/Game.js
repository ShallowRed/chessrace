import events from 'app/models/events';
import GameEvents from 'app/events/';
import LevelModel from 'app/models/level';

import EnnemiesCollection from 'app/models/ennemies-collection';
import Board from 'app/components/board/Board';
import Player from 'app/components/pieces/Player-piece';
import PlayArea from 'app/models/play-area';

import { getBoundMethods } from 'app/utils/bind-methods';

export default {

  init(levelConfig, levelBlueprint) {

    Object.assign(this, levelConfig);

    const { columns, rows, visibleRows } = this;

    const [color, ennemiesColor] = this.piecesColors;

    this.model = new LevelModel(levelBlueprint, columns, rows, visibleRows);

    this.ennemies = new EnnemiesCollection(ennemiesColor);

    this.board = new Board(columns, visibleRows);

    this.setDimensions();

    this.render();

    this.player = new Player({ color, ...this.playerStart });

    getBoundMethods.call(this, GameEvents, events.listen);

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
  },

  resize() {

    this.setDimensions();

    this.board.render(this.model, { resize: true });

    this.player.moveSprite();

    this.ennemies.setEachPosition();

    this.forEachPiece(piece => {

      piece.setSpriteSize();
    });
  },

  forEachPiece(callback) {

    [this.player, ...this.ennemies.collection].forEach(callback);
  }
}
