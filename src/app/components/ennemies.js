import EnnemyPiece from 'app/components/Ennemy-piece';

export const Ennemies = {

  list: [],

  add(pieceName, position, map) {
    const ennemy = new EnnemyPiece(pieceName, position, map);
    this.list.push(ennemy);
  },

  remove(ennemy) {
    ennemy.remove();
    this.list.splice(this.list.indexOf(ennemy), 1);
  },

  reset() {

    this.list.forEach(ennemy => {
      ennemy.remove();
    });

    this.list = [];
  }
}
