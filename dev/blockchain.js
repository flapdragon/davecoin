class Blockchain {
  constructor() {
    this.chain = []
    this.pendingTransactions = []
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    // Create new block
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash
    }

    // Reset transactions
    this.pendingTransactions = []

    // Add new block to blockchain
    this.chain.push(newBlock)

    return newBlock
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  createNewTransaction(amount, sender, recipient) {
    // Create new transaction
    const newTransaction = {
      amount,
      sender,
      recipient
    }
  
    // Add to transactions
    this.pendingTransactions.push(newTransaction)
  
    return this.getLastBlock()["index"] + 1
  }
}

export default Blockchain
