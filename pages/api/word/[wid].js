import { Word } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  put: update,
  delete: _delete,
});


async function update(req, res) {
  const word = await Word.findByIdAndUpdate(req.query.wid, req.body, { new: true })
  res.json(word)
}

async function _delete(req, res) {
  const word = await Word.findByIdAndDelete(req.query.wid)
  res.json(word)
}
