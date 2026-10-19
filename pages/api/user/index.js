import { User } from 'models'
import { apiHandler, withAuth } from 'utils'
import { checkNewPassword } from 'libs/password'

// ข้อมูลผู้ใช้สำหรับหน้าแอดมิน (มีรหัสผ่าน ไม่มีรายการคำ)
const adminUser = (u) => { const { words, __v, ...rest } = u.toObject ? u.toObject() : u; return rest }

// [security patch] รายชื่อผู้ใช้ / สร้างผู้ใช้ = admin เท่านั้น
export default apiHandler({
  get: withAuth(getList, { admin: true }),
  post: withAuth(create, { admin: true }),
});

// แอดมินเห็นรหัสผ่านนักเรียนได้ (ตามที่ครูโจต้องการ) · หน้า User ซ่อนไว้เป็น •••• กดดูทีละคน
async function getList(req, res) {
  const users = await User.find(null, { words: 0 })
  res.json(users)
}

// [v1.3.1] สร้างผู้ใช้: ตรวจรหัสผ่าน (อย่างน้อย 4 ตัว) และ Username ซ้ำ · ไม่รับ field ระบบ (_id, words, ...) จากหน้าเว็บ
async function create(req, res) {
  const body = req.body && typeof req.body === 'object' ? { ...req.body } : {}
  const err = checkNewPassword(body.password)
  if (err) return res.status(400).json({ message: err })
  delete body._id; delete body.__v; delete body.words
  if (typeof body.username === 'string' && await User.exists({ username: body.username }))
    return res.status(400).json({ message: 'มี Username นี้อยู่แล้ว' })
  const user = await User.create(body)
  res.json(adminUser(user))
}
