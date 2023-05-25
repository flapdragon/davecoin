function Blockchain() {
  this.chain = []
  this.newTransactions = []
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  // Create new block
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.newTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash
  }

  // Reset transactions
  this.newTransactions = []

  // Add new block to blockchain
  this.chain.push(newBlock)

  return newBlock
}

Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1]
}

module.exports = Blockchain