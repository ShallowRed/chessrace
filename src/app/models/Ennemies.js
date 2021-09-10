import EnnemyPiece from 'app/components/pieces/Ennemy-piece';

export default class Ennemies {

  list = [];

  constructor(color) {
    this.color = color;
  }

  add({ pieceName, position }, skippedRows) {

    const ennemy = new EnnemyPiece(pieceName, position, this.color, skippedRows);

    this.list.push(ennemy);
  }

  addEach(ennemies, skippedRows) {
    ennemies.forEach(ennemy => {
      this.add(ennemy, skippedRows)
    });
  }

  setEachPosition(skippedRows) {
    this.list.forEach(ennemy =>
      ennemy.setAbsolutePosition(skippedRows)
    );
  }

  remove(ennemy) {

    ennemy.removeSprite();

    this.list.splice(this.list.indexOf(ennemy), 1);
  }

  empty() {

    if (this.list) {
      this.list.forEach(ennemy =>
        ennemy.removeSprite()
      );
    }

    this.list = [];
  }
}
