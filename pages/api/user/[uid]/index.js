import { User } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  put: update,
});


async function update(req, res) {
  const user = await User.findByIdAndUpdate(req.query.uid, req.body, { new: true })
  res.json(user)
}
