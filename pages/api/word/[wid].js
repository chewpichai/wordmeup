import { Word } from 'models'
import { apiHandler, withAuth } from 'utils'

export default apiHandler({
  // [security patch] admin เท่านั้น
  put: withAuth(update, { admin: true }),
  delete: withAuth(_delete, { admin: true }),
});


async function update(req, res) {
  const word = await Word.findByIdAndUpdate(req.query.wid, req.body, { new: true })
  res.json(word)
}

async function _delete(req, res) {
  const word = await Word.findByIdAndDelete(req.query.wid)
  res.json(word)
}
