import express from "express"

const app = express()
const port = 3000

app.get("/blockchain", (req, res) => {
  res.send("")
})

app.post("/transaction", (req, res) => {

})

app.get("/mine", (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})