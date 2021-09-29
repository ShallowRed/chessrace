import { generateLevelBlueprint } from 'app/utils/level-generator';

const levelConfig = {

  board: {
    columns: 8,
    rows: 16,
    visibleRows: 12,
  },

  playerSpawn: {
    position: [3, 0],
    pieceName: "queen"
  },

  durations: {
    move: 0.3,
    scroll: 2,
    fall: 1
  }
}

export default {
  ...levelConfig,
  blueprint: generateLevelBlueprint(levelConfig.board)
}
