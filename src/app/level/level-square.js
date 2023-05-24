export default {
    isInBoard([col, row]) {
        return col >= 0 &&
            row >= 0 &&
            col < this.columns &&
            row <= this.rows;
    },
    get([col, row]) {
        return this.blueprint[row]?.[col];
    },
    isHole(squareCoords) {
        return this.square.get(squareCoords) === 0;
    },
    isEnnemy(squareCoords) {
        return this.square.get(squareCoords) > 1;
    },
    isObstacle(squareCoords) {
        return this.square.isHole(squareCoords) ||
            this.square.isEnnemy(squareCoords);
    }
};
