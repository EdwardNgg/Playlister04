import JsTpsTransaction from '../common/JsTpsTransaction';

/**
 * DeleteSong_Transaction
 *
 * This class represents a transaction that deletes a song
 * in the playlist. It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author ?
 */
export default class RemoveSongTransaction extends JsTpsTransaction {
  constructor(initStore, initIndex, initSong) {
    super();
    this.store = initStore;
    this.index = initIndex;
    this.song = initSong;
  }

  doTransaction() {
    this.store.removeSong(this.index);
  }

  undoTransaction() {
    this.store.createSong(this.index, this.song);
  }
}
