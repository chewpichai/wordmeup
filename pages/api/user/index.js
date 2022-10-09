import { User } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  get: getList,
  post: create,
});


async function getList(req, res) {
  const users = await User.find(null, { words: 0 })
  res.json(users)
}

async function create(req, res) {
  const user = await User.create(req.body)
  res.json(user)
}
