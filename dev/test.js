import Blockchain from "./blockchain.js"

const davecoin = new Blockchain()

// Sample chain from test data  
const testChain01 = {
  "chain": [
    {
      "index": 1,
      "timestamp": 1686074541391,
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
      "timestamp": 1686074565080,
      "transactions": [],
      "nonce": 100,
      "previousBlockHash": "0",
      "hash": "0"
    },
    {
      "index": 2,
      "timestamp": 1686074568578,
      "transactions": [],
      "nonce": 2125,
      "previousBlockHash": "0",
      "hash": "000059eb65fc162c2544fa84f2512c89cd9a83e023f07c956334f47ee6ac144c"
    }
  ],
  "pendingTransactions": [
    {
      "amount": 6.45601608,
      "sender": "000000000000000000000000000000000000000000",
      "recipient": "56ab1e70049411ee99d94fe5d7f513ee",
      "transactionId": "58c32900049411ee99d94fe5d7f513ee"
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
