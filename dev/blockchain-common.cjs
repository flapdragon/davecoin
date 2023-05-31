const sha256 = require("sha256") // Deprecated
const { v1: uuidv1 } = require("uuid")

// Get node URL from command process args
const currentNodeUrl = process.argv[3]

function Blockchain() {
  this.chain = []
  this.pendingTransactions = []
  
  this.currentNodeUrl = currentNodeUrl
  this.networkNodes = []

  // Create genesis block
  this.createNewBlock(100, "0", "0")
}

// Creates a new block, adds all pending transactions to the block, adds block to the blockchain
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
  // Create new block
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    previousBlockHash: previousBlockHash,
    hash: hash
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
    recipient,
    transactionId: uuidv1().split("-").join("")
  }

  return newTransaction
}

// Adds transaction to pending transactions array
Blockchain.prototype.addTransactionToPendingTransactions = function(transaction) {
  // Add to transactions
  this.pendingTransactions.push(transaction)
  return this.getLastBlock()["index"] + 1
}

// Creates a sha256 hash for the block using the previous block's hash, current block's data and the nonce
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
  // Gather and convert all black data to a string
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
  // Hash the string using sha256
  const hash = sha256(dataAsString)
  return hash
}

// Loops over nonces incrementally until a hash is generated that begins with 4 0s, using previous block hash,
// current block data and the correct nonce.
// My computer will probably crash.
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
  // Initialize nonce
  let nonce = 0
  // Create block hash
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  while (hash.substring(0, 4) !== "0000") {
    nonce++
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  }

  return nonce
}

module.exports = Blockchain