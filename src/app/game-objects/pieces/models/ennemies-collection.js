import EnnemyPiece from 'app/game-objects/pieces/ennemy-sprite';

export default class EnnemiesCollection {

  collection = [];

  constructor(color) {

    this.color = color;
  }

  add({ pieceName, position }) {

    const ennemy = new EnnemyPiece(this.color, { pieceName, position });

    ennemy.render();

    this.collection.push(ennemy);
  }

  addEach(newEnnemyPieces) {

    for (const ennemyProps of newEnnemyPieces) {

      this.add(ennemyProps);
    }
  }

  remove(ennemy) {

    ennemy.removeSprite();

    this.collection.splice(this.collection.indexOf(ennemy), 1);
  }

  removeEach(ennemies) {

    for (const ennemy of ennemies) {

      this.remove(ennemy);
    }
  }

  removeAll() {

    for (const ennemy of this.collection) {

      ennemy.removeSprite();
    }

    this.collection = [];
  }

  setEachPosition() {

    for (const ennemy of this.collection) {

      ennemy.setAbsolutePosition();
    }
  }
}
