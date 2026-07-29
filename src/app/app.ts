import events from 'app/game-events/event-emitter';

import Game from 'app/game';
import PlayArea from 'app/game-objects/board/models/play-area';
import Hud from 'app/ui/hud';
import Menu from 'app/ui/menu';
import Result from 'app/ui/result';
import Sound from 'app/ui/sound';

import { levelConfig } from 'app/level/config';
import { devAsked, loadDev, loadMuted, saveDev, saveMuted } from 'app/settings';
import { levelBySlug, levels, worlds } from 'app/level/catalogue';
import { par, rate } from 'app/level/par';

import {
  isUnlocked,
  loadProgress,
  nextLevel,
  recordPlay,
  recordRun,
  saveProgress
} from 'app/progress';

import type { Level } from 'app/level/catalogue';
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

  private dev: boolean;

  constructor(private readonly storage: KeyValueStore) {

    this.progress = loadProgress(storage);

    this.dev = loadDev(storage);

    this.sound = new Sound(
      () => new AudioContext(),
      loadMuted(storage)
    );

    this.menu = new Menu(worlds, level => this.play(level));

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

  start(slug: string | null, search = ""): void {

    const asked = slug === null ? undefined : levelBySlug(slug);

    const wanted = devAsked(search);

    if (wanted !== undefined && wanted !== this.dev) {

      this.dev = wanted;

      saveDev(this.storage, wanted);
    }

    if (asked && this.isOpen(asked)) return this.play(asked);

    this.openMenu();
  }

  private isOpen(level: Level): boolean {

    return this.dev || isUnlocked(this.progress, worlds, level.slug);
  }

  private openMenu(): void {

    this.stop();

    this.result.hide();

    this.hud.hide();

    this.menu.show(this.progress, this.dev);
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

    this.progress = recordPlay(this.progress, level);

    if (outcome === "won") {

      this.progress = recordRun(this.progress, level.slug, moves);
    }

    saveProgress(this.storage, this.progress);

    if (outcome === "lost") return this.result.showLoss(level);

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
