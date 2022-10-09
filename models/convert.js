const fs = require('fs')
const readline = require('readline')

const stream = fs.createReadStream('words.txt')
const lines = readline.createInterface({ input: stream, crlfDelay: Infinity })
const words = []
lines.on('line', line => {
  const [word, trans] = line.split('=')
  const pattern = /\((.+)\)/
  const m = pattern.exec(word)
  words.push({
    word: word.split(' ')[0].trim(),
    pos: m[1],
    translation: trans.trim(),
    types: ['CUTEP'],
    __v: 0
  })
})
lines.on('close', () => {
  fs.writeFileSync('words.json', JSON.stringify(words), 'utf8')
})
