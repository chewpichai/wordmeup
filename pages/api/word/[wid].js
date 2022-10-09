import { Word } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  put: update,
});


async function update(req, res) {
  const word = await Word.findByIdAndUpdate(req.query.wid, req.body, { new: true })
  res.json(word)
}
