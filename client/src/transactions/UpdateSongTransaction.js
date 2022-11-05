import JsTpsTransaction from '../common/JsTpsTransaction';

/**
 * UpdateSong_Transaction
 *
 * This class represents a transaction that updates a song
 * in the playlist. It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author ?
 */
export default class UpdateSongTransaction extends JsTpsTransaction {
  constructor(initStore, initIndex, initOldSongData, initNewSongData) {
    super();
    this.store = initStore;
    this.index = initIndex;
    this.oldSongData = initOldSongData;
    this.newSongData = initNewSongData;
  }

  doTransaction() {
    this.store.updateSong(this.index, this.newSongData);
  }

  undoTransaction() {
    this.store.updateSong(this.index, this.oldSongData);
  }
}
