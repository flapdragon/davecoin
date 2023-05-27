const express = require("express")

// Initialize Express
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const port = 3000

// Blockchain
app.get("/blockchain", function (req, res) {
  res.send("blockchain")
})

// Transaction
app.post("/transaction", function (req, res) {
  console.log(req.body)
  res.send(`The amount of the transaction is ${req.body.amount} Davecoin.`)
})

// Mine
app.get("/mine", function (req, res) {
  res.send("mine")
})

// Start server
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})