import GameObject from 'app/game-objects/game-object';
import PlayArea from 'app/game-objects/board/models/play-area';

import type { Coords, PieceColor, PieceName } from 'app/types';

export interface PieceOptions {
  color: PieceColor;
  position: Coords;
  pieceName: PieceName;
  type: "player" | "enemy";
}

export default class Piece extends GameObject {

  declare sprite: HTMLDivElement;

  declare color: PieceColor;

  declare position: Coords;

  declare pieceName: PieceName;

  declare type: "player" | "enemy";

  isPlayer = false;

  isMoving = false;

  isFalling = false;

  constructor({ color, position, pieceName, type }: PieceOptions) {

    super({
      domEl: { sprite: document.createElement('div') },
      className: type,
      inContainer: true
    });

    Object.assign(this, { color, position, pieceName, type });
  }

  render(): void {

    this.setSpriteSize();

    this.setSpriteClassName();
  }

  setSpriteSize(): void {

    this.style = {
      width: PlayArea.squareSize,
      height: PlayArea.squareSize
    };
  }

  setSpriteClassName(): void {

    this.sprite.className =
      `piece ${this.type} ${this.color} ${this.pieceName}`;
  }

  removeSprite(): void {

    GameObject.remove(this.container as GameObject);
  }

  set piece(pieceName: PieceName) {

    this.pieceName = pieceName;

    this.setSpriteClassName();
  }

  get piece(): PieceName {

    return this.pieceName;
  }

  get offset(): { left: number; bottom: number } {

    const [col, row] = this.position;

    const { squareSize, offset } = PlayArea;

    return {
      left: col * squareSize + offset.left,
      bottom: (row + 1) * squareSize
    }
  }

  fall(duration: number): void {

    this.sprite.style.transitionDuration = `${duration}s`;

    this.sprite.style.transform +=
      "translate(15px, 15px) scale(0) rotate(180deg)";
  }
}
