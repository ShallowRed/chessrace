import EnnemyPiece from 'app/components/Pieces/Ennemy-piece';

export default {

  list: [],

  add(pieceName, position, nRenders) {
    
    const ennemy = new EnnemyPiece(pieceName, position, nRenders);
    
    this.list.push(ennemy);
  },

  remove(ennemy) {

    ennemy.removeSprite();

    this.list.splice(this.list.indexOf(ennemy), 1);
  },

  reset() {

    this.list.forEach(ennemy =>
      ennemy.removeSprite()
    );

    this.list = [];
  }
}
