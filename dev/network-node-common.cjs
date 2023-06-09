const express = require("express")
const Blockchain = require("./blockchain-common.cjs")
const { v1: uuidv1 } = require("uuid")
const rp = require("request-promise")

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
  // Get transaction from request
  const newTransaction = req.body
  // Add transaction to pending transactions array and get block index of block it will be added to
  const blockIndex = davecoin.addTransactionToPendingTransactions(newTransaction)
  res.json({ "note": `Transaction will be added in block ${blockIndex}`})
})

// Broadcast transaction
app.post("/transaction/broadcast", function (req, res) {
  // Get transaction from request
  const newTransaction = davecoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  // Add to pending transactions
  davecoin.addTransactionToPendingTransactions(newTransaction)
  // Broadcast new transaction
  const requestPromises = []
  davecoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true
    }

    requestPromises.push(rp(requestOptions))
  })

  Promise.all(requestPromises)
    .then(data => {
      res.json({ "note": "Transaction created and broadcast successfully." })
    })
})

// Mine
app.get("/mine", function (req, res) {
  // Get previous block
  const previousBlock = davecoin.getLastBlock()
  const previousBlockHash = previousBlock["hash"]
  // Set current block data
  const currentBlockData = {
    index: previousBlock.index + 1,
    transactions: davecoin.pendingTransactions,
    previousBlockHash: previousBlockHash
  }
  // Calculate nonce
  const nonce = davecoin.proofOfWork(previousBlockHash, currentBlockData)
  // Hash current block
  const blockHash = davecoin.hashBlock(previousBlockHash, currentBlockData, nonce)
  // Create new block
  const newBlock = davecoin.createNewBlock(nonce, previousBlockHash, blockHash)

  // Broadcast new block to all nodes
  const requestPromises = []
  davecoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true
    }

    requestPromises.push(rp(requestOptions))
  })

  Promise.all(requestPromises)
    .then(data => {
      // Send reward to block miner
      const requestOptions = {
        uri: davecoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: { amount: 6.45601608, sender: "000000000000000000000000000000000000000000", recipient: nodeAddress },
        json: true
      }

      return rp(requestOptions)
    })
    .then( data => {
      res.json({
        "note": "New block mined and broadcast successfully.",
        "block": newBlock
      })
    })
})

// Receive new block
app.post("/receive-new-block", function(req, res) {
    // Get block from request
    const newBlock = req.body.newBlock
    // Get previous block
    const lastBlock = davecoin.getLastBlock()
    // If new block has the correct previous hash and correct index
    // TODO: seems like there are some other things we can check for
    if (lastBlock.hash === newBlock.previousBlockHash && lastBlock["index"] + 1 === newBlock["index"]) {
      // Add new block to chain
      davecoin.chain.push(newBlock)
      // Reset pending transactions
      davecoin.pendingTransactions = []
      res.json({
        "note": "New block received and accepted.",
        "newBlock": newBlock
      })
    }
    // If not then send reject response
    else {
      res.json({
        "note": "New block rejected",
        "newBlock": newBlock
      })
    }
})

// Register and broadcast node to the network
app.post("/register-and-broadcast-node", function(req, res) {
  // Get node from request
  const newNodeUrl = req.body.newNodeUrl
  // TODO: There should be one method inside the blockchain class or somewhere to handle this rather than
  // random pushes like this.
  // Add to network nodes array
  if (davecoin.networkNodes.indexOf(newNodeUrl) == -1) {
    davecoin.networkNodes.push(newNodeUrl)
  }
  // Broadcast to all existing nodes
  const regNodesPromises = []
  davecoin.networkNodes.forEach(networkNodeUrl => {
    // TODO: Refactor this to hit a local function rather than hitting the API over the network
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true
    }
    regNodesPromises.push(rp(requestOptions))
  })

  Promise.all(regNodesPromises)
    .then(data => {
      // TODO: Refactor this to hit a local function rather than hitting the API over the network
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: "POST",
        body: { allNetworkNodes: [ ...davecoin.networkNodes, davecoin.currentNodeUrl ] },
        json: true
      }
      return rp(bulkRegisterOptions)
    })
      .then(data => {
        res.json({ "note": "New node registered with network succesfully." })
      })
})

// Register node with the network
app.post("/register-node", function (req, res) {
  // TODO: Refactor if statements to set appropriate response for each case.
  //   Right now it replies with the same message no matter what
  // Get new node url from request
  const newNodeUrl = req.body.newNodeUrl
  // If node is not already in array and if it's not the same as the current node (not itself)
  if (davecoin.networkNodes.indexOf(newNodeUrl) == -1 && davecoin.currentNodeUrl !== newNodeUrl) {
    // Add node to network nodes array
    davecoin.networkNodes.push(newNodeUrl)
  }
  res.json({ "note": "New node registered successfully."})
})

// Register multiple nodes
// TODO: How do Bitcoin type network nodes actually communicate and register with each other?
app.post("/register-nodes-bulk", function(req, res) {
  const allNetworkNodes = req.body.allNetworkNodes
  allNetworkNodes.forEach(networkNodeUrl => {
    // If node is not already in array and if it's not the same as the current node (not itself)
    if (davecoin.networkNodes.indexOf(networkNodeUrl) == -1 && davecoin.currentNodeUrl !== networkNodeUrl) {
      // Add node to network nodes array
      davecoin.networkNodes.push(networkNodeUrl)
    }
  })
  res.json({ "note": "Bulk registration successful."})
})

// Start server
app.listen(port, function() {
  console.log(`Listening on port ${port}...`)
})