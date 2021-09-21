import EnnemyPiece from 'app/components/pieces/Ennemy-piece';

export default class EnnemiesCollection {

  collection = [];

  constructor(color) {

    this.color = color;
  }

  add = props => {

    const ennemy = new EnnemyPiece({ color: this.color, ...props });

    this.collection.push(ennemy);
  }

  addEach(ennemies) {

    ennemies.forEach(this.add);
  }

  setEachPosition() {

    for (const ennemy of this.collection) {

      ennemy.setAbsolutePosition();
    }
  }

  remove(ennemy) {

    ennemy.removeSprite();

    this.collection.splice(this.collection.indexOf(ennemy), 1);
  }

  empty() {

    for (const ennemy of this.collection) {

      this.remove(ennemy)
    }
  }
}
