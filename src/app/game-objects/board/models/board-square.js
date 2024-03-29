import PlayArea from 'app/game-objects/board/models/play-area';
const { floor } = Math;
export const getSquare = {
    left(col) {
        return col * PlayArea.squareSize;
    },
    top(row) {
        return (this.rows - row + this.nRenders) * PlayArea.squareSize;
    },
    coordsInCanvas([col, row]) {
        return {
            left: this.getSquare.left(col),
            top: this.getSquare.top(row)
        };
    },
    coord(coordInCanvas) {
        return floor(coordInCanvas / PlayArea.squareSize);
    },
    clicked({ target, clientX, clientY }) {
        const { left, bottom } = target.getBoundingClientRect();
        const clientCoordsInCanvas = [
            clientX - left,
            bottom - clientY
        ];
        const [col, row] = clientCoordsInCanvas.map(this.getSquare.coord);
        return [col, row + this.nRenders - 1];
    }
};
export const isSquare = {
    light([col, row]) {
        return !((col + row + 1) % 2);
    },
    dark([col, row]) {
        return !((col + row) % 2);
    },
    inBottomRow(coords) {
        return coords[1] === this.nRenders;
    },
    notInBottomRow(coords) {
        return coords[1] !== this.nRenders;
    },
    leftToHole([col, row]) {
        return !this.squares.includes([col + 1, row]);
    },
    belowHole([col, row]) {
        return !this.squares.includes([col, row - 1]);
    }
};
