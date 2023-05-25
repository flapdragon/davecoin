function Blockchain() {
  this.chain = []
  this.pendingTransactions = []
}

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

module.exports = Blockchain