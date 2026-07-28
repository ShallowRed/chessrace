import events from 'app/game-events/event-emitter';

import GameEvents from 'app/game-events';
import LevelModel from 'app/level/level';

import GameObject from 'app/game-objects/game-object';
import EnemiesCollection from 'app/game-objects/pieces/models/enemies-collection';
import Board from 'app/game-objects/board/board';
import Player from 'app/game-objects/pieces/player-sprite';

import { getBoundMethods } from 'app/utils/bind-methods';
import { getRandomPiecesColor } from 'app/utils/get-random-pieces-color';
import { scrollDuration } from 'app/level/tempo';

import type { EventListener, EventName } from 'app/game-events/event-emitter';
import type Piece from 'app/game-objects/pieces/piece-sprite';
import type { Durations, LevelConfig, RunResult } from 'app/types';

export default class Game {

  on = false;

  moves = 0;

  onOutcome?: (result: RunResult) => void;

  durations: Durations;

  model: LevelModel;

  board: Board;

  player: Player;

  enemies: EnemiesCollection;

  constructor({
    board: { columns, rows, visibleRows },
    playerSpawn,
    durations,
    blueprint
  }: LevelConfig) {


    this.durations = durations;


    this.model = new LevelModel(blueprint, { columns, rows, visibleRows });

    this.board = new Board({ columns, rows: visibleRows });


    const [playerColor, enemiesColor] = getRandomPiecesColor();

    this.player = new Player(playerColor, playerSpawn);

    this.enemies = new EnemiesCollection(enemiesColor);
  }

  init(): void {

    this.model.reset();

    this.board.setDimensions();

    this.render();

    this.player.render();

    this.addListeners();

  }

  addListeners(): void {

    getBoundMethods.call(
      this,
      GameEvents,
      (message, listener) => {

        events.on(
          message as EventName,
          listener as EventListener<EventName>
        );
      }
    );

    window.addEventListener("resize", this.onResize);
  }

  destroy(): void {

    this.on = false;

    events.reset();

    window.removeEventListener("resize", this.onResize);

    GameObject.container.empty();
  }

  finish(outcome: RunResult["outcome"]): void {

    this.on = false;

    const { moves } = this;

    this.reset();

    this.render();

    this.onOutcome?.({ outcome, moves });
  }

  private readonly onResize = () => this.resize();

  render(): void {

    if (this.board.nRenders) {

      this.board.clear();
    }

    this.model.parseNextRows();

    this.board.render(this.model);

    this.board.nRenders++;

    if (this.model.newEnemyPieces.length) {

      this.enemies.addEach(this.model.newEnemyPieces);
    }
  }

  reset(): void {

    events.emit("TRANSLATE_BOARD");

    events.emit("TRANSLATE_PIECES");

    this.board.nRenders = 0;

    this.board.clear();

    this.enemies.removeAll();

    this.model.reset();

    this.player.reset();

    this.moves = 0;
  }

  resize(): void {

    this.board.setDimensions();

    this.board.render(this.model);

    for (const piece of this.pieces) {

      piece.setSpriteSize();
    }

    this.player.moveSprite();

    this.enemies.setEachPosition();
  }

  get scrollDuration(): number {

    return scrollDuration(this.durations, this.board.nRenders);
  }

  get pieces(): Piece[] {

    return [this.player, ...this.enemies.collection];
  }

  get offBoardPieces(): Piece[] {

    const boardLimit = this.board.nRenders - 1;

    return this.pieces.filter(({ position }) => {

      return position[1] < boardLimit
    })
  }
}
