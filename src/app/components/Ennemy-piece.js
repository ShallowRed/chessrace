import events from 'app/utils/event-emitter';
import Piece from 'app/components/Piece';

export default class EnnemyPiece extends Piece {

  constructor(pieceName, position, map) {

    const sprite = document.createElement("div");

    super(pieceName, sprite, map);

    map.container.append(this.sprite);
    this.sprite.className = `piece ${pieceName} black`;
    this.position = position;
    this.move();
    this.sprite.addEventListener("click", () =>
      events.emit("ENNEMY_CLICKED", this)
    );
  }

  remove() {
    this.sprite.parentNode.removeChild(this.sprite);
  }
}
