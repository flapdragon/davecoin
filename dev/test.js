import Blockchain from "./blockchain.js"

const davecoin = new Blockchain()

// Sample chain from test data  
const testChain01 = {
  "chain": [
    {
      "index": 1,
      "timestamp": 1686075323260,
      "transactions": [],
      "nonce": 100,
      "previousBlockHash": "0",
      "hash": "0"
    }
  ],
  "pendingTransactions": [],
  "currentNodeUrl": "http://localhost:3001",
  "networkNodes": []
}
console.log("Valid01:", davecoin.chainIsValid(testChain01.chain))

const testChain02 = {
  "chain": [
    {
      "index": 1,
      "timestamp": 1686076341686,
      "transactions": [],
      "nonce": 100,
      "previousBlockHash": "0",
      "hash": "0"
    },
    {
      "index": 2,
      "timestamp": 1686076350192,
      "transactions": [],
      "nonce": 36566,
      "previousBlockHash": "0",
      "hash": "000062a5631639091c140c203f9c938e33564ca7fd352c4b3bb2d1cd557b9b13"
    }
  ],
  "pendingTransactions": [
    {
      "amount": 6.45601608,
      "sender": "000000000000000000000000000000000000000000",
      "recipient": "799b8740049811ee8f2f53d43e51164c",
      "transactionId": "7eb03000049811ee8f2f53d43e51164c"
    }
  ],
  "currentNodeUrl": "http://localhost:3001",
  "networkNodes": []
}
console.log("Valid02:", davecoin.chainIsValid(testChain02.chain))


// NOTES: Bitcoin address formats
// P2PKH/Legacy
// 1BvBMSEYstWetqTFd5Au4m4GFg7xJaNVN2
// P2SH
// 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLd
// Bech32
// bc1qw508d6qejxtdg4y5r3zarvard0c5xw7kv8f3t4
