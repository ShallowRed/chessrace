import events from 'app/game-events/event-emitter';

import Game from 'app/game';
import PlayArea from 'app/game-objects/board/models/play-area';
import Hud from 'app/ui/hud';
import Menu from 'app/ui/menu';
import Result from 'app/ui/result';
import Sound from 'app/ui/sound';

import { levelConfig } from 'app/level/level-config';
import { loadMuted, saveMuted } from 'app/settings';
import { levelBySlug, levels } from 'app/level/levels';
import { par, rate } from 'app/level/par';

import {
  isUnlocked,
  loadProgress,
  nextLevel,
  recordRun,
  saveProgress
} from 'app/progress';

import type { Level } from 'app/level/levels';
import type { Progress } from 'app/progress';
import type { KeyValueStore } from 'app/storage';
import type { RunResult } from 'app/types';

export default class App {

  private readonly menu: Menu;

  private readonly hud: Hud;

  private readonly result: Result;

  private readonly sound: Sound;

  private progress: Progress;

  private game: Game | undefined;

  private level: Level | undefined;

  constructor(private readonly storage: KeyValueStore) {

    this.progress = loadProgress(storage);

    this.sound = new Sound(
      () => new AudioContext(),
      loadMuted(storage)
    );

    this.menu = new Menu(levels, level => this.play(level));

    this.hud = new Hud({
      onMenu: () => this.openMenu(),
      onToggleSound: () => this.toggleSound()
    }, this.sound.isMuted);

    this.result = new Result({
      onNext: () => this.playNext(),
      onRetry: () => this.level && this.play(this.level),
      onMenu: () => this.openMenu()
    });
  }

  start(slug: string | null): void {

    const asked = slug === null ? undefined : levelBySlug(slug);

    if (asked && isUnlocked(this.progress, levels, asked.slug)) {

      return this.play(asked);
    }

    this.openMenu();
  }

  private openMenu(): void {

    this.stop();

    this.result.hide();

    this.hud.hide();

    this.menu.show(this.progress);
  }

  private play(level: Level): void {

    this.stop();

    this.menu.hide();

    this.result.hide();

    this.hud.show(level);

    PlayArea.reservedBottom = this.hud.height;

    this.level = level;

    this.game = new Game(levelConfig(level));

    this.game.onOutcome = result => this.report(level, result);

    this.game.init();

    this.listenForCues();
  }

  private listenForCues(): void {

    events.on("MOVE_PLAYER", () => this.sound.play("move"));

    events.on("EAT_PIECE", () => this.sound.play("capture"));

    events.on("GAME_OVER", () => this.sound.play("fall"));

    events.on("GAME_WON", () => this.sound.play("win"));
  }

  private toggleSound(): boolean {

    const muted = this.sound.toggle();

    saveMuted(this.storage, muted);

    return muted;
  }

  private playNext(): void {

    const following = this.level && nextLevel(levels, this.level.slug);

    if (following) return this.play(following);

    this.openMenu();
  }

  private report(level: Level, { outcome, moves }: RunResult): void {

    if (outcome === "lost") return this.result.showLoss(level);

    this.progress = recordRun(this.progress, level.slug, moves);

    saveProgress(this.storage, this.progress);

    const shortest = par(level);

    this.result.showWin({
      level,
      moves,
      shortest,
      rating: rate(moves, shortest),
      hasNext: nextLevel(levels, level.slug) !== undefined
    });
  }

  private stop(): void {

    this.game?.destroy();

    this.game = undefined;
  }
}
