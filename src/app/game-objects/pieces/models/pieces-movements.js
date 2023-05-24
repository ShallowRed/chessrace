const { abs } = Math;
export function isValidMove({ position, pieceName }, targetPosition) {
    return Pieces[pieceName].isValidMove(position, targetPosition);
}
export function isValidTake({ position, pieceName }, ennemyPosition) {
    return (Pieces[pieceName].isValidTake ||
        Pieces[pieceName].isValidMove)(position, ennemyPosition);
}
export function isLongRange(pieceName) {
    return Pieces[pieceName].isLongRange || false;
}
const Pieces = {
    pawn: {
        isValidMove: ([x1, y1], [x2, y2]) => (y2 === y1 + 1 &&
            x1 === x2),
        isValidTake: ([x1, y1], [x2, y2]) => (y2 === y1 + 1 &&
            (x2 === x1 - 1 ||
                x2 === x1 + 1))
    },
    king: {
        isValidMove: ([x1, y1], [x2, y2]) => (abs(x1 - x2) <= 1 &&
            abs(y1 - y2) <= 1)
    },
    knight: {
        isValidMove: ([x1, y1], [x2, y2]) => (abs(x1 - x2) === 2 &&
            abs(y1 - y2) === 1) || (abs(x1 - x2) === 1 &&
            abs(y1 - y2) === 2)
    },
    bishop: {
        isLongRange: true,
        isValidMove: ([x1, y1], [x2, y2]) => (abs(x1 - x2) === abs(y1 - y2))
    },
    rook: {
        isLongRange: true,
        isValidMove: ([x1, y1], [x2, y2]) => (x1 === x2 ||
            y1 === y2)
    },
    queen: {
        isLongRange: true,
        isValidMove: (...coords) => (Pieces.bishop.isValidMove(...coords) ||
            Pieces.rook.isValidMove(...coords))
    }
};
