class Blockchain {
  constructor() {
    this.chain = []
    this.newTransactions = []
  }

  createNewBlock(nonce, previousBlockHash, hash) {
    // Create new block
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.newTransactions,
      ...arguments
    }

    // Reset transactions
    this.newTransactions = []

    // Add new block to blockchain
    this.chain.push(newBlock)

    return newBlock
  }
}

export default Blockchain
