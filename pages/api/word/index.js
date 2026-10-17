import { Word } from 'models'
import { apiHandler, withAuth } from 'utils'

export default apiHandler({
  // [security patch] จัดการคลังคำ = admin เท่านั้น
  get: withAuth(getList, { admin: true }),
  post: withAuth(create, { admin: true }),
});

async function getList(req, res) {
  const words = await Word.find()
  res.json(words)
}

async function create(req, res) {
  const word = await Word.create(req.body)
  res.json(word)
}
