import { DURATIONS, VISIBLE_ROWS } from 'app/config';

import type { Level } from 'app/level/levels';
import type { LevelConfig } from 'app/types';

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
