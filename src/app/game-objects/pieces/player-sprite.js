import events from 'app/game-events/event-emitter';
import Piece from 'app/game-objects/pieces/piece-sprite';
export default class Player extends Piece {
    constructor(color, { position, pieceName }) {
        super({ color, position, pieceName, type: "player" });
        this.isPlayer = true;
        this.spawn = { position, pieceName };
    }
    render() {
        super.render();
        this.moveSprite();
    }
    reset() {
        const { pieceName, position } = this.spawn;
        this.piece = pieceName;
        this.position = position;
        this.moveSprite();
    }
    moveSprite({ duration = 0 } = {}) {
        const { left, bottom } = this.offset;
        this.sprite.style.transitionDuration = `${duration}s`;
        this.sprite.style.transform = `translate(${left}px, -${bottom}px)`;
        this.setFlag("isMoving", duration);
    }
    fall(duration) {
        super.fall(duration);
        this.setFlag("isFalling", duration);
        events.timeout("GAME_OVER", duration);
    }
    setFlag(flag, duration) {
        this[flag] = true;
        setTimeout(() => {
            this[flag] = false;
        }, duration);
    }
}
