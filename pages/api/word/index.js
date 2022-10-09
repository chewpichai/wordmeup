import { Word } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  get: getList,
  post: create,
});

async function getList(req, res) {
  const words = await Word.find()
  res.json(words)
}

async function create(req, res) {
  const word = await Word.create(req.body)
  res.json(word)
}
