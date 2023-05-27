const express = require('express')

const app = express()
const port = 3000

app.get('/blockchain', function (req, res) {
  res.send('')
})

app.post("/transaction", function (req, res) {

})

app.get("/mine", function (req, res) {

})

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})