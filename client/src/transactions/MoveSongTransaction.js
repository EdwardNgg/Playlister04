import JsTpsTransaction from '../common/JsTpsTransaction';
/**
 * MoveSong_Transaction
 *
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveSongTransaction extends JsTpsTransaction {
  constructor(initStore, initOldSongIndex, initNewSongIndex) {
    super();
    this.store = initStore;
    this.oldSongIndex = initOldSongIndex;
    this.newSongIndex = initNewSongIndex;
  }

  doTransaction() {
    this.store.moveSong(this.oldSongIndex, this.newSongIndex);
  }

  undoTransaction() {
    this.store.moveSong(this.newSongIndex, this.oldSongIndex);
  }
}
