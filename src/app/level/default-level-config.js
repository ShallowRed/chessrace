import { generateLevelBlueprint } from 'app/utils/level-generator';
const boardDimensions = {
    columns: 8,
    rows: 17,
    visibleRows: 12,
};
export default {
    board: boardDimensions,
    blueprint: generateLevelBlueprint(boardDimensions),
    playerSpawn: {
        position: [3, 0],
        pieceName: "queen"
    },
    durations: {
        move: 0.3,
        scroll: 2,
        fall: 1
    }
};
