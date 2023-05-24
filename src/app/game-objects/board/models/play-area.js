const { max, min, round } = Math;
export default {
    squareSize: 0,
    width: 0,
    height: 0,
    thickness: 0,
    offset: {
        top: 0,
        left: 0,
        right: 0,
        shadow: 0,
    },
    input: {
        thickness: 0,
        height: 0,
        width: 0,
        edgeToHole: {
            width: 0,
            thickness: 0
        }
    },
    squareSizeRatios: {
        BOARD_THICKNESS: 1 / 6,
        BOARD_OFFSET_SHADOW: 1 / 3,
        INPUT_HEIGHT: 1 / 5,
        INPUT_EDGETOHOLE_WIDTH: 1 / 10,
        INPUT_EDGETOHOLE_THICKNESS: 1 / 16,
    },
    getSquareRatio(key) {
        return round(this.squareSize * this.squareSizeRatios[key]);
    },
    setDimensions(columns, rows) {
        this.squareSize = min(round(window.innerWidth / (columns + 1)), round(window.innerHeight / (rows + 2)));
        this.width = columns * this.squareSize;
        this.height = rows * this.squareSize;
        this.thickness = this.getSquareRatio("BOARD_THICKNESS");
        this.setInputDimensions();
        this.setOffsetDimensions();
    },
    setInputDimensions() {
        this.input.height = this.getSquareRatio("INPUT_HEIGHT");
        this.input.edgeToHole = {
            width: this.getSquareRatio("INPUT_EDGETOHOLE_WIDTH"),
            thickness: this.getSquareRatio("INPUT_EDGETOHOLE_THICKNESS")
        };
        this.input.width = this.width + this.input.edgeToHole.width * 2;
        this.input.thickness = this.thickness + this.input.edgeToHole.thickness * 2;
    },
    setOffsetDimensions() {
        this.offset.shadow = this.getSquareRatio("BOARD_OFFSET_SHADOW");
        this.offset.left = this.input.edgeToHole.thickness + this.input.edgeToHole.width;
        this.offset.right = max(this.offset.left, this.offset.shadow);
        this.offset.top = this.input.height + this.input.edgeToHole.thickness;
    }
};
