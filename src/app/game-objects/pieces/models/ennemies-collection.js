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

  remove(ennemy) {

    ennemy.removeSprite();

    this.collection.splice(this.collection.indexOf(ennemy), 1);
  }

  addEach(newEnnemyPieces) {

    for (const ennemyProps of newEnnemyPieces) {

      this.add(ennemyProps);
    }
  }

  setEachPosition() {

    for (const ennemy of this.collection) {

      ennemy.setAbsolutePosition();
    }
  }

  removeAll() {

    for (const ennemy of this.collection) {

      ennemy.removeSprite();
    }

    this.collection = [];
  }
}
