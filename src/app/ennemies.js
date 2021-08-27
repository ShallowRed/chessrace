import EnnemyPiece from 'app/components/Ennemy-piece';

export default {

  add({ pieceName, position }) {

    const ennemy = new EnnemyPiece(pieceName, position);

    this.list.push(ennemy);
  },

  addEach(ennemies) {
    ennemies.forEach(ennemy => {
      this.add(ennemy)
    });
  },

  remove(ennemy) {

    ennemy.removeSprite();

    this.list.splice(this.list.indexOf(ennemy), 1);
  },

  reset() {

    if (this.list) {
      this.list.forEach(ennemy =>
        ennemy.removeSprite()
      );
    }

    this.list = [];
  }
}
