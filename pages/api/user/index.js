import { User } from 'models'
import { apiHandler, withAuth } from 'utils'

// [security patch] รายชื่อผู้ใช้ / สร้างผู้ใช้ = admin เท่านั้น
export default apiHandler({
  get: withAuth(getList, { admin: true }),
  post: withAuth(create, { admin: true }),
});

async function getList(req, res) {
  const users = await User.find(null, { words: 0 })
  res.json(users)
}

async function create(req, res) {
  const user = await User.create(req.body)
  res.json(user)
}
