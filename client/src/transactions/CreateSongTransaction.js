import JsTpsTransaction from '../common/JsTpsTransaction';
/**
 * CreateSong_Transaction
 *
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author ?
 */
export default class CreateSongTransaction extends JsTpsTransaction {
  constructor(initStore, initIndex, initSong) {
    super();
    this.store = initStore;
    this.index = initIndex;
    this.song = initSong;
  }

  doTransaction() {
    this.store.createSong(this.index, this.song);
  }

  undoTransaction() {
    this.store.removeSong(this.index);
  }
}
