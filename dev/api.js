import express from "express"
import Blockchain from "./blockchain.js"

// Initialize Express
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = 3000

// Initialize blockchain
const davecoin = new Blockchain()

// Blockchain
app.get("/blockchain", (req, res) => {
  res.send(davecoin)
})

// Transaction
app.post("/transaction", (req, res) => {
  const blockIndex = davecoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  res.json({ "note": `Transaction will be added in block ${blockIndex}`})
})

// Mine
app.get("/mine", (req, res) => {
  res.send("mine")
})

// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})