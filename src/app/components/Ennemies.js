import EnnemyPiece from 'app/components/Ennemy-piece';

export default class Ennemies {

  list = [];

  constructor(color) {
    this.color = color;
  }

  add({ pieceName, position }) {

    const ennemy = new EnnemyPiece(pieceName, position, this.color);

    this.list.push(ennemy);
  }

  addEach(ennemies) {
    ennemies.forEach(ennemy => {
      this.add(ennemy)
    });
  }

  setEachPosition() {
    this.list.forEach(ennemy =>
      ennemy.setAbsolutePosition()
    );
  }

  remove(ennemy) {

    ennemy.removeSprite();

    this.list.splice(this.list.indexOf(ennemy), 1);
  }

  reset() {

    if (this.list) {
      this.list.forEach(ennemy =>
        ennemy.removeSprite()
      );
    }

    this.list = [];
  }
}
