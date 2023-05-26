const sha256 = require("sha256")

function Blockchain() {
  this.chain = []
  this.pendingTransactions = []
}

// Creates a new block, adds all pending transactions to the block, adds block to the blockchain
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  // Create new block
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  }

  // Reset transactions
  this.pendingTransactions = []

  // Add new block to blockchain
  this.chain.push(newBlock)

  return newBlock
}

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1]
}

// Creates a new transaction and adds to the pending transacations array
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
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
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
  const hash = sha256(dataAsString)
  return hash
}

module.exports = Blockchain