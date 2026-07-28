import EnemyPiece from 'app/game-objects/pieces/enemy-sprite';

export default class EnemiesCollection {

  collection = [];

  constructor(color) {

    this.color = color;
  }

  add({ pieceName, position }) {

    const enemy = new EnemyPiece(this.color, { pieceName, position });

    enemy.render();

    this.collection.push(enemy);
  }

  addEach(newEnemyPieces) {

    for (const enemyProps of newEnemyPieces) {

      this.add(enemyProps);
    }
  }

  remove(enemy) {

    enemy.removeSprite();

    this.collection.splice(this.collection.indexOf(enemy), 1);
  }

  removeEach(enemies) {

    for (const enemy of enemies) {

      this.remove(enemy);
    }
  }

  removeAll() {

    for (const enemy of this.collection) {

      enemy.removeSprite();
    }

    this.collection = [];
  }

  setEachPosition() {

    for (const enemy of this.collection) {

      enemy.setAbsolutePosition();
    }
  }
}
