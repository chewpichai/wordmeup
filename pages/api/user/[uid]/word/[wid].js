import { User, Word } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  put: update,
});


async function update(req, res) {
  const user = await User.findById(req.query.uid)
  const word = await Word.findById(req.query.wid)
  const i = user.words.findIndex(w => w.word === word._id)
  const userWord = {
    word: word._id,
    ...req.body
  }
  if (req.body.next)
    userWord.next += user.numRounds
  if (i === -1) {
    user.words.push(userWord)
  } else {
    user.words.splice(i, 1, userWord)
  }
  await user.save()
  res.json(word)
}
