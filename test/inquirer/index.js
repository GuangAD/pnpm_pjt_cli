const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('write something ', (input) => {
  console.log(input)

  rl.close()
})
