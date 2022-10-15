import { User } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  put: update,
  delete: _delete,
});


async function update(req, res) {
  const user = await User.findById(req.query.uid)
  if (req.body.finish) {
    user.numRounds += 1
  } else {
    Object.keys(req.body).map(k => user[k] = req.body[k])
  }
  await user.save()
  res.json(user)
}

async function _delete(req, res) {
  const user = await User.findByIdAndDelete(req.query.uid)
  res.json(user)
}
