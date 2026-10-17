const jwt = require('jsonwebtoken')
import { User } from 'models'
import { apiHandler, JWT_SECRET } from 'utils'

export default apiHandler({
  post: authenticate
})

async function authenticate(req, res) {
  // [security patch] ไม่ส่ง req.body เข้า query ตรงๆ (กัน NoSQL injection) · รับเฉพาะข้อความ
  const raw = typeof req.body?.username === 'string' ? req.body.username : ''
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  if (!raw || !password)
    return res.status(403).end('No username or password.')
  // หา username ตามที่พิมพ์ก่อน (เหมือนระบบเดิม) ถ้าไม่เจอค่อยลองแบบตัดช่องว่างหัวท้าย (เผื่อพิมพ์เว้นวรรคเกิน)
  let user = await User.findOne({ username: raw })
  if (!user && raw.trim() && raw.trim() !== raw) user = await User.findOne({ username: raw.trim() })
  if (!user || user.deleted || user.password !== password)
    return res.status(403).end('No username or password.')
  const now = new Date()
  if (!user.isAdmin && (user.startDate > now || now > user.endDate))
    return res.status(403).end('Not in learning period.')
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  const { password: _p, words, ...rest } = user._doc
  return res.status(200).json({ ...rest, token })
}
