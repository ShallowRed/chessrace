import LevelSquare from 'app/level/level-square';
import { parseBlueprint } from 'app/utils/parse-blueprint';
import { bindObjectsMethods } from "app/utils/bind-methods";
export default class LevelModel {
    constructor(blueprint, { columns, rows, visibleRows }) {
        this.pieces = ['bishop', 'king', 'knight', 'pawn', 'queen', 'rook'];
        Object.assign(this, { columns, rows, visibleRows });
        this.blueprint = parseBlueprint(blueprint, columns);
        bindObjectsMethods.call(this, { square: LevelSquare });
    }
    reset() {
        this.deepRegularSquares = [];
        this.lastRowRendered = -1;
        this.rowToRenderUpTo = this.visibleRows + 1;
    }
    parseNextRows() {
        this.newEnnemyPieces = [];
        let rowIndex = this.lastRowRendered + 1;
        const isVisible = (rowIndex) => rowIndex <= this.rowToRenderUpTo && rowIndex < this.rows;
        for (rowIndex; isVisible(rowIndex); rowIndex++) {
            const { regularSquares, newEnnemies } = this.parseRow(rowIndex);
            this.deepRegularSquares.push(regularSquares);
            this.newEnnemyPieces.push(...newEnnemies);
            this.lastRowRendered = rowIndex;
        }
        this.rowToRenderUpTo = this.lastRowRendered + 1;
        if (this.lastRowRendered > this.visibleRows + 1) {
            this.deepRegularSquares.shift();
        }
        this.regularSquares = this.deepRegularSquares.flat();
    }
    parseRow(rowIndex) {
        const filterableRow = this.blueprint?.[rowIndex]
            ?.map((value, index) => ({ value, index }));
        const isNotHole = ({ value }) => value > 0;
        const isEnnemy = ({ value }) => value > 1;
        const getSquareCoords = ({ index }) => [index, rowIndex];
        const getPieceName = (value) => this.pieces[value - 2];
        const getPiecePositionAndName = ({ value, index }) => ({
            pieceName: getPieceName(value),
            position: getSquareCoords({ value, index })
        });
        return {
            regularSquares: filterableRow
                ?.filter(isNotHole)
                ?.map(getSquareCoords),
            newEnnemies: filterableRow
                ?.filter(isEnnemy)
                ?.map(getPiecePositionAndName)
        };
    }
}
