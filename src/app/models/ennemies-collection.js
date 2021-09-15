import EnnemyPiece from 'app/components/pieces/Ennemy-piece';

export default class EnnemiesCollection {

  collection = [];

  constructor(color) {

    this.color = color;
  }

  add = props => {

    const ennemy = new EnnemyPiece({ ...props, color: this.color });

    this.collection.push(ennemy);
  }

  addEach(ennemies) {

    ennemies.forEach(this.add);
  }

  setEachPosition() {

    this.collection.forEach(ennemy => {

      ennemy.setAbsolutePosition();
    });
  }

  remove(ennemy) {

    ennemy.removeSprite();

    this.collection.splice(this.collection.indexOf(ennemy), 1);
  }

  empty() {

    if (this.collection) {

      this.collection.forEach(ennemy => {

        ennemy.removeSprite();
      });
    }

    this.collection = [];
  }
}
