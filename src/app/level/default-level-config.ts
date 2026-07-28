import { defaultLevel } from 'app/level/levels';

import type { Level } from 'app/level/levels';
import type { Durations, LevelConfig } from 'app/types';

const VISIBLE_ROWS = 12;

const DURATIONS: Durations = {
  move: 0.3,
  scroll: 2,
  fall: 1,
  speedUp: 1,
  minScroll: 0.9
};

export function levelConfig(level: Level): LevelConfig {

  return {

    board: {
      columns: level.columns,
      rows: level.rows,
      visibleRows: VISIBLE_ROWS
    },

    blueprint: level.blueprint,

    playerSpawn: {
      position: level.spawn.position,
      pieceName: level.spawn.pieceName
    },

    durations: { ...DURATIONS, speedUp: level.speedUp ?? DURATIONS.speedUp }
  };
}

export default levelConfig(defaultLevel);
