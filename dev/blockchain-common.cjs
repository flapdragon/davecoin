const sha256 = require("sha256") // Deprecated
const { v1: uuidv1 } = require("uuid")

// TODO: The network-node /mine endpoint and the chainIsValid method both create blocks but use their own code
//   They need to use a shared block creation method that lives in Blockchain class
// TODO: The block that is created for hashing is not the same as the one that gets added to the chain, see
//   createNewBlock. Obviously. But there is overlap in functionality like index, timestamp, transactions
//   that needs to be separated.
// TODO: Local servers should not hit their own APIs. Functionality in those APIs need to be in
//   their own local functions that are shared by the API and the local functionality. There should be a
//   clear distinction between local and network calls.

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

// Validate chain
Blockchain.prototype.chainIsValid = function(blockchain) {
    // Initialize valid chain boolean
    let validChain = true
    // Loop over chain, start at index 1 (skipping the genesis block)
    for (let i = 1, chainLength = blockchain.length; i < chainLength; i++) {
      // Get current block
      const currentBlock = blockchain[i]
      // Format block data the way it was when it was hashed and created
      const currentBlockData = {
        index: currentBlock.index,
        transactions: currentBlock.transactions,
        previousBlockHash: currentBlock.previousBlockHash
      }
      // Get previous block
      const previousBlock = blockchain[i - 1]
      // Hash current block to validate its data
      const blockHash = this.hashBlock(previousBlock.hash, currentBlockData, currentBlock.nonce)

      // Validate current block's hash.
      // If current block's hash does not start with 0000
      if (blockHash.substring(0, 4) !== "0000") {
        // Set valid chain to false
        validChain = false
      }

      // Validate that current block has the correct previous block hash.
      // If current block's previous hash property does not equal the previous block's hash
      if (currentBlock.previousBlockHash !== previousBlock.hash) {
        // Set valid chain to false
        validChain = false
      }
    }

    // Get genesis block
    const genesisBlock = blockchain[0]
    // Validate genesis block
    // If data does not match the data on the Blockchain constructor above
    if (genesisBlock.nonce !== 100 || genesisBlock.previousBlockHash !== "0" || genesisBlock.hash !== "0" || genesisBlock.transactions.length !== 0) {
      // Set valid chain to false
      validChain = false
    }

    return validChain
}

module.exports = Blockchain