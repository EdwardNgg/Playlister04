/**
 * JsTpsTransaction
 *
 * This provides the basic structure for a transaction class. Note to use
 * JsTps one should create objects that define these two methods, doTransaction
 * and undoTransaction, which will update the application state accordingly.
 *
 * @author THE McKilla Gorilla (accept no imposters)
 * @version 1.0
 */
export default class JsTpsTransaction {
  /**
   * This method is called by JsTps when a transaction is executed.
   */
  // eslint-disable-next-line class-methods-use-this
  doTransaction() {
    console.log('doTransaction - MISSING IMPLEMENTATION');
  }

  /**
   * This method is called by JsTps when a transaction is undone.
   */
  // eslint-disable-next-line class-methods-use-this
  undoTransaction() {
    console.log('undoTransaction - MISSING IMPLEMENTATION');
  }
}
