import Blockchain from "./blockchain.js"

const bitcoin = new Blockchain()

// Test block creation (empty)
bitcoin.createNewBlock(800098812, "c52c4fb88926f84bcbc39459fb74792f00032309d52aa2f242741702958003cc", "9d053755e078005ef63af6258f5a743994a11d17daca304d49dec6c3ded3fba8")

// Test transaction and block creation with 1 transaction
bitcoin.createNewTransaction(0.39212860, "bc1qewf0u2ztugn6sdmlt7zc7g8nytljli4jc66zd2", "1dLHFRY0QJoWYdgd3Ei6y9yRlEOJv5JvQl")
bitcoin.createNewBlock(1233600134, "9d053755e078005ef63af6258f5a743994a11d17daca304d49dec6c3ded3fba8", "aa6890829510931f9593852ec1d97209340be9883c8b675accdd54b582e32219")

// Test transaction and block creation with 3 transactions
bitcoin.createNewTransaction(0.01365100, "bc1m36j3zwwt6j2m9lzm4c1c0khla9gkt32mcpzmvy", "bc1vmvdh8w97kcerwsj0cqpz3zi8n90g7o6hvcf93l")
bitcoin.createNewTransaction(0.36837716, "bc1qewf0u2ztugn6sdmlt7zc7g8nytljli4jc66zd2", "bc1m36j3zwwt6j2m9lzm4c1c0khla9gkt32mcpzmvy")
bitcoin.createNewTransaction(6.77803854, "bc109194zb8ekqk4uutwc5fsz4ok5zajjdy2pf62lp", "bc1vzggu5v4r0unlke7nqf36pmhdkkvwx3uf7yp21d")
bitcoin.createNewBlock(2057796636, "aa6890829510931f9593852ec1d97209340be9883c8b675accdd54b582e32219", "2db317222c996b6380f1b4f1102253cbec31685ef0ff4a71f665136bfa717cad")

// Test block hash
const previousBlockHash = bitcoin.chain[bitcoin.chain.length - 1].hash
const currentBlockData = [
  {
    amount: 7.01194739,
    sender: "bc1vzggu5v4r0unlke7nqf36pmhdkkvwx3uf7yp21d",
    recipient: "bc1m36j3zwwt6j2m9lzm4c1c0khla9gkt32mcpzmvy"
  },
  {
    amount: 57.97787373,
    sender: "bc109194zb8ekqk4uutwc5fsz4ok5zajjdy2pf62lp",
    recipient: "bc1vmvdh8w97kcerwsj0cqpz3zi8n90g7o6hvcf93l"
  },
  {
    amount: 0.05824079,
    sender: "bc1vmvdh8w97kcerwsj0cqpz3zi8n90g7o6hvcf93l",
    recipient: "bc1qewf0u2ztugn6sdmlt7zc7g8nytljli4jc66zd2"
  }
]
const nonce = 865897280
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))

console.log(bitcoin)

// NOTES: Bitcoin address formats
// P2PKH/Legacy
// 1BvBMSEYstWetqTFd5Au4m4GFg7xJaNVN2
// P2SH
// 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLd
// Bech32
// bc1qw508d6qejxtdg4y5r3zarvard0c5xw7kv8f3t4