import sha256 from "sha256" // Deprecated
import { v1 as uuidv1 } from "uuid";

// Get node URL from command process args
const currentNodeUrl = process.argv[3]

class Blockchain {
  constructor() {
    this.chain = []
    this.pendingTransactions = []

    this.currentNodeUrl = currentNodeUrl
    this.networkNodes = []

    // Create genesis block
    this.createNewBlock(100, "0", "0")
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
      recipient,
      transactionId: uuidv1().split("-").join("")
    }

    return newTransaction
  }

  // Adds transaction to pending transactions array
  addTransactionToPendingTransactions(transaction) {
    // Add to transactions
    this.pendingTransactions.push(transaction)
    return this.getLastBlock()["index"] + 1
  }

  // Creates a sha256 hash for the block using the previous block's hash, current block's data and the nonce
  hashBlock(previousBlockHash, currentBlockData, nonce) {
    // Gather and convert all black data to a string
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    // Hash the string using sha256
    const hash = sha256(dataAsString)
    return hash
  }

  // Loops over nonces incrementally until a hash is generated that begins with 4 zeros, using previous block hash,
  // current block data and the correct nonce.
  // My computer will probably crash.
  proofOfWork(previousBlockHash, currentBlockData) {
    // Initialize nonce
    let nonce = 0
    // Create block hash
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    while (hash.substring(0, 4) !== "0000") {
      nonce++
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }

    // Return the nonce that helps generate the correct hash that starts with 4 zeros
    return nonce
  }
}

export default Blockchain
