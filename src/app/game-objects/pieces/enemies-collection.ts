import EnemyPiece from 'app/game-objects/pieces/enemy';

import type { PieceColor, PiecePlacement } from 'app/types';

export default class EnemiesCollection {

  collection: EnemyPiece[] = [];

  color: PieceColor;

  constructor(color: PieceColor) {

    this.color = color;
  }

  add({ pieceName, position }: PiecePlacement): void {

    const enemy = new EnemyPiece(this.color, { pieceName, position });

    enemy.render();

    this.collection.push(enemy);
  }

  addEach(newEnemyPieces: PiecePlacement[]): void {

    for (const enemyProps of newEnemyPieces) {

      this.add(enemyProps);
    }
  }

  remove(enemy: EnemyPiece): void {

    enemy.removeSprite();

    this.collection.splice(this.collection.indexOf(enemy), 1);
  }

  removeEach(enemies: EnemyPiece[]): void {

    for (const enemy of enemies) {

      this.remove(enemy);
    }
  }

  removeAll(): void {

    for (const enemy of this.collection) {

      enemy.removeSprite();
    }

    this.collection = [];
  }

  setEachPosition(): void {

    for (const enemy of this.collection) {

      enemy.setAbsolutePosition();
    }
  }
}
