const Blockchain = require("./blockchain-common.cjs")

const bitcoin = new Blockchain()

// Test genesis block
console.log(bitcoin)

// NOTES: Bitcoin address formats
// P2PKH/Legacy
// 1BvBMSEYstWetqTFd5Au4m4GFg7xJaNVN2
// P2SH
// 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLd
// Bech32
// bc1qw508d6qejxtdg4y5r3zarvard0c5xw7kv8f3t4
