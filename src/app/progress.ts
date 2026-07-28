import type { Level } from 'app/level/levels';

export interface Progress {
  best: Record<string, number>;
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const KEY = "chessrace.progress";

export const noProgress: Progress = { best: {} };

export function loadProgress(storage: ProgressStorage): Progress {

  const stored = storage.getItem(KEY);

  if (!stored) return noProgress;

  try {

    const parsed: unknown = JSON.parse(stored);

    const best = (parsed as Progress | null)?.best;

    if (!best || typeof best !== "object") return noProgress;

    return {
      best: Object.fromEntries(Object
        .entries(best)
        .filter(([, moves]) => typeof moves === "number"))
    };

  } catch {

    return noProgress;
  }
}

export function saveProgress(storage: ProgressStorage, progress: Progress): void {

  storage.setItem(KEY, JSON.stringify(progress));
}

export function recordRun(progress: Progress, slug: string, moves: number): Progress {

  const previous = progress.best[slug];

  if (previous !== undefined && previous <= moves) return progress;

  return { best: { ...progress.best, [slug]: moves } };
}

export function isCompleted(progress: Progress, slug: string): boolean {

  return progress.best[slug] !== undefined;
}

export function isUnlocked(
  progress: Progress,
  levels: Level[],
  slug: string
): boolean {

  const index = levels.findIndex(level => level.slug === slug);

  if (index <= 0) return index === 0;

  return isCompleted(progress, levels[index - 1]?.slug ?? "");
}

export function nextLevel(levels: Level[], slug: string): Level | undefined {

  return levels[levels.findIndex(level => level.slug === slug) + 1];
}
