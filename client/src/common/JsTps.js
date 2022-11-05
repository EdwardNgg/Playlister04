/**
 * JsTps
 *
 * This class serves as the Transaction Processing System. Note that it manages
 * a stack of JsTps_Transaction objects, each of which know how to do or undo
 * state changes for the given application. Note that this TPS is not platform
 * specific as it is programmed in raw JavaScript.
 */
export default class JsTps {
  constructor() {
    // THE TRANSACTION STACK
    this.transactions = [];

    // THE TOTAL NUMBER OF TRANSACTIONS ON THE STACK,
    // INCLUDING THOSE THAT MAY HAVE ALREADY BEEN UNDONE
    this.numTransactions = 0;

    // THE INDEX OF THE MOST RECENT TRANSACTION, NOTE THAT
    // THIS MAY BE IN THE MIDDLE OF THE TRANSACTION STACK
    // IF SOME TRANSACTIONS ON THE STACK HAVE BEEN UNDONE
    // AND STILL COULD BE REDONE.
    this.mostRecentTransaction = -1;

    // THESE STATE VARIABLES ARE TURNED ON AND OFF WHILE
    // TRANSACTIONS ARE DOING THEIR WORK SO AS TO HELP
    // MANAGE CONCURRENT UPDATES
    this.performingDo = false;
    this.performingUndo = false;
  }

  /**
     * isPerformingDo
     *
     * Accessor method for getting a boolean representing whether or not
     * a transaction is currently in the midst of a do/redo operation.
     */
  isPerformingDo() {
    return this.performingDo;
  }

  /**
     * isPerformingUndo
     *
     * Accessor method for getting a boolean representing whether or not
     * a transaction is currently in the midst of an undo operation.
     */
  isPerformingUndo() {
    return this.performingUndo;
  }

  /**
     * getSize
     *
     * Accessor method for getting the number of transactions on the stack.
     */
  getSize() {
    return this.transactions.length;
  }

  /**
     * getRedoSize
     *
     * Method for getting the total number of transactions on the stack
     * that can possibly be redone.
     */
  getRedoSize() {
    return this.getSize() - this.mostRecentTransaction - 1;
  }

  /**
     * getUndoSize
     *
     * Method for getting the total number of transactions on the stack
     * that can possible be undone.
     */
  getUndoSize() {
    return this.mostRecentTransaction + 1;
  }

  /**
     * hasTransactionToRedo
     *
     * Method for getting a boolean representing whether or not
     * there are transactions on the stack that can be redone.
     */
  hasTransactionToRedo() {
    return (this.mostRecentTransaction + 1) < this.numTransactions;
  }

  /**
     * hasTransactionToUndo
     *
     * Method for getting a boolean representing whehter or not
     * there are transactions on the stack that can be undone.
     */
  hasTransactionToUndo() {
    return this.mostRecentTransaction >= 0;
  }

  /**
     * addTransaction
     *
     * Method for adding a transaction to the TPS stack, note it
     * also then does the transaction.
     *
     * @param {JsTps_Transaction} transaction Transaction to add to the stack and do.
     */
  addTransaction(transaction) {
    // ARE WE BRANCHING?
    if ((this.mostRecentTransaction < 0)
            || (this.mostRecentTransaction < (this.transactions.length - 1))) {
      for (let i = this.transactions.length - 1; i > this.mostRecentTransaction; i -= 1) {
        this.transactions.splice(i, 1);
      }
      this.numTransactions = this.mostRecentTransaction + 2;
    } else {
      this.numTransactions += 1;
    }

    // ADD THE TRANSACTION
    this.transactions[this.mostRecentTransaction + 1] = transaction;

    // AND EXECUTE IT
    this.doTransaction();
  }

  /**
     * doTransaction
     *
     * Does the current transaction on the stack and advances the transaction
     * counter. Note this function may be invoked as a result of either adding
     * a transaction (which also does it), or redoing a transaction.
     */
  doTransaction() {
    if (this.hasTransactionToRedo()) {
      this.performingDo = true;
      const transaction = this.transactions[this.mostRecentTransaction + 1];
      transaction.doTransaction();
      this.mostRecentTransaction += 1;
      this.performingDo = false;
    }
  }

  /**
     * This function gets the most recently executed transaction on the
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
  undoTransaction() {
    if (this.hasTransactionToUndo()) {
      this.performingUndo = true;
      const transaction = this.transactions[this.mostRecentTransaction];
      transaction.undoTransaction();
      this.mostRecentTransaction -= 1;
      this.performingUndo = false;
    }
  }

  /**
     * clearAllTransactions
     *
     * Removes all the transactions from the TPS, leaving it with none.
     */
  clearAllTransactions() {
    // REMOVE ALL THE TRANSACTIONS
    this.transactions = [];

    // MAKE SURE TO RESET THE LOCATION OF THE
    // TOP OF THE TPS STACK TOO
    this.mostRecentTransaction = -1;
    this.numTransactions = 0;
  }

  /**
     * toString
     *
     * Builds and returns a textual represention of the full TPS and its stack.
     */
  toString() {
    let text = `--Number of Transactions: ${this.numTransactions}\n`;
    text += `--Current Index on Stack: ${this.mostRecentTransaction}\n`;
    text += '--Current Transaction Stack:\n';
    for (let i = 0; i <= this.mostRecentTransaction; i += 1) {
      const jT = this.transactions[i];
      text += `----${jT.toString()}\n`;
    }
    return text;
  }
}
