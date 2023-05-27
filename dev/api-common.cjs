const express = require("express")
const Blockchain = require("./blockchain-common.cjs")

// Initialize Express
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = 3000

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
  res.send("mine")
})

// Start server
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})