const express = require("express")
const Blockchain = require("./blockchain-common.cjs")
const { v1: uuidv1 } = require("uuid");

// Initialize node
const nodeAddress = uuidv1().split("-").join("")

// Initialize Express
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = process.argv[2]

// Initialize blockchain
const davecoin = new Blockchain()

// Blockchain
app.get("/blockchain", function (req, res) {
  res.send(davecoin)
})

// Transaction
app.post("/transaction", function (req, res) {
  const blockIndex = davecoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  res.json({ "note": `Transaction will be added in block ${blockIndex}`})
})

// Mine
app.get("/mine", function (req, res) {
  // Get previous block
  const previousBlock = davecoin.getLastBlock()
  const previousBlockHash = previousBlock["hash"]
  // Set current block data
  const currentBlockData = {
    index: previousBlock + 1,
    timestamp: Date.now(),
    transactions: davecoin.pendingTransactions,
    previousBlockHash: previousBlockHash
  }
  // Calculate nonce
  const nonce = davecoin.proofOfWork(previousBlockHash, currentBlockData)
  // Hash current block
  const blockHash = davecoin.hashBlock(previousBlockHash, currentBlockData, nonce)

  // Send reward to block miner
  davecoin.createNewTransaction(6.45601608, "000000000000000000000000000000000000000000", nodeAddress)

  // Create new block
  const newBlock = davecoin.createNewBlock(nonce, previousBlockHash, blockHash)
  res.json({
    "note": "New block mined successfully.",
    "block": newBlock
  })
})

// Start server
app.listen(port, function() {
  console.log(`Listening on port ${port}...`)
})