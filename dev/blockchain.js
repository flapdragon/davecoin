import sha256 from "sha256"

class Blockchain {
  constructor() {
    this.chain = []
    this.pendingTransactions = []
  }

  // Creates a new block, adds all pending transactions to the block, adds block to the blockchain
  createNewBlock(nonce, previousBlockHash, hash) {
    // Create new block
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      previousBlockHash,
      hash
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

  // Creates a new transaction and adds to the pending transacations array
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

  // Creates a sha256 hash for the block using the previous block's hash, current block's data and the nonce
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    const hash = sha256(dataAsString)
    return hash
  }
}

export default Blockchain
