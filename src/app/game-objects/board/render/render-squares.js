import { arrayIncludesArray } from "app/utils/array-includes-array";
export function render(regularSquares) {
    this.squares.includes = arrayIncludesArray(regularSquares);
    this.squares.renderSquaresSet(regularSquares, this.canvas.shadows);
    this.squares.renderColoredSquares(regularSquares);
}
export function renderSquaresSet(squares, canvas) {
    squares.map(this.getSquare.coordsInCanvas)
        .map(canvas.getShape)
        .forEach(canvas.draw);
}
const SQUARE_COLORS_KEYS = ["light", "dark"];
export function renderColoredSquares(squares) {
    for (const color of SQUARE_COLORS_KEYS) {
        const sameColorSquares = squares.filter(this.isSquare[color]);
        const colorShades = this.colors.squares[color];
        this.squares.renderSquaresOfColor(sameColorSquares, colorShades);
    }
}
export function renderSquaresOfColor(squares, colorShades) {
    for (const canvas of this.canvas.coloredCollection) {
        const coloredSquaresInCanvas = canvas.filter?.call(this, squares) || squares;
        canvas.ctx.fillStyle = colorShades[canvas.shape.type];
        this.squares.renderSquaresSet(coloredSquaresInCanvas, canvas);
    }
}
