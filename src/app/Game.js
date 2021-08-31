import * as GameEvents from 'app/game-events';
import GameObject from 'app/components/Game-object';
import Ennemies from 'app/components/Ennemies';
import LevelModel from 'app/level-model';
import BoardCanvas from 'app/components/Board-canvas';
import Player from 'app/components/Player-piece';
import events from 'app/utils/event-emitter';
import { getRandomPiecesColor } from 'app/utils/utils';

export default {

  rows: 12,

  startPos: [4, 2],
  startPiece: "queen",

  translationDuration: 1,
  spriteSpeed: 0.3,

  piecesColors: getRandomPiecesColor(),

  init(levelBlueprint) {
    this.parseBlueprint(levelBlueprint);
    this.createGameObjects();
    this.render();
    this.bindEvents();
    this.listenWindowResizing();
  },

  parseBlueprint(levelBlueprint) {
    this.columns = levelBlueprint.columns;
    this.model = new LevelModel(levelBlueprint, this.rows);
  },

  createGameObjects() {

    const [playerColor, ennemyColor] = this.piecesColors;

    GameObject.setSquareSize(this.columns, this.rows);
    this.board = new BoardCanvas(this.columns, this.rows);
    this.ennemies = new Ennemies(ennemyColor);
    this.player = new Player(this.startPiece, this.startPos, playerColor);
  },

  bindEvents() {
    for (const message in GameEvents) {
      if (typeof GameEvents[message] !== "function") return;
      events.on(message, GameEvents[message].bind(this));
    }
  },

  render() {

    const { regularSquares, newEnnemyPieces } = this.model.parse();
    const { lastRowRendered, rows } = this.model;

    this.board.render(regularSquares);

    if (newEnnemyPieces.length) {
      this.ennemies.addEach(newEnnemyPieces);
    }

    if (lastRowRendered === rows) {
      this.board.renderEnd(lastRowRendered);
    };
  },

  reset() {
    GameObject.skippedRows = 0;
    this.model.reset();
    this.board.reset();
    this.ennemies.reset();
    this.player.reset();
    this.player.moveSprite({ duration: 0 });
  },

  listenWindowResizing() {
    window.addEventListener("resize", () => {
      events.emit("RESIZE")
    });
  }
}
