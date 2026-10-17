// [Let's Practice / security patch] ตรวจ token ฝั่ง server ทุก API
const jwt = require('jsonwebtoken')
import getConfig from 'next/config'
import { User } from 'models'

const { serverRuntimeConfig } = getConfig()
// ใช้ค่า env ถ้ามี (แนะนำ) ไม่งั้นใช้ค่าเดิมใน next.config.js
export const JWT_SECRET = process.env.JWT_SECRET || serverRuntimeConfig.secret

function inLearningPeriod(user) {
  if (user.isAdmin) return true
  const now = new Date()
  if (user.startDate && user.startDate > now) return false
  if (user.endDate && now > user.endDate) return false
  return true
}

// ตรวจ token (header Authorization: Bearer <token>) → { user } หรือ { reason }
// reason: 'login' = ไม่มี/หมดอายุ/ไม่ถูกต้อง · 'period' = บัญชีไม่อยู่ในช่วงเวลาเรียน (หมดอายุ/ยังไม่เริ่ม/ถูกลบ)
export async function checkAuth(req) {
  const m = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i)
  if (!m) return { reason: 'login' }
  let sub
  try {
    sub = jwt.verify(m[1], JWT_SECRET).sub
  } catch (e) {
    return { reason: 'login' }
  }
  const user = typeof sub === 'string' && /^[0-9a-fA-F]{24}$/.test(sub) ? await User.findById(sub) : null
  if (!user) return { reason: 'login' }
  if (user.deleted || !inLearningPeriod(user)) return { reason: 'period' }
  return { user }
}

// คืน user ที่ login อยู่ หรือ null
export async function getAuthUser(req) {
  return (await checkAuth(req)).user || null
}

// ห่อ handler: ต้อง login · opts.admin = ต้องเป็น admin · opts.owner = uid ใน URL ต้องเป็นของตัวเอง (หรือ admin)
export function withAuth(fn, opts = {}) {
  return async (req, res) => {
    const { user: me, reason } = await checkAuth(req)
    if (!me) return res.status(401).json({ message: 'Please log in again.', code: reason })
    if (opts.admin && !me.isAdmin) return res.status(403).json({ message: 'Admin only.' })
    if (opts.owner && !me.isAdmin && String(me._id) !== String(req.query.uid))
      return res.status(403).json({ message: 'Not allowed.' })
    req.me = me
    return fn(req, res)
  }
}

// ตัด field ลับออกก่อนส่งให้นักเรียน
export function publicUser(user) {
  const { password, words, __v, ...rest } = (user.toObject ? user.toObject() : user)
  return rest
}
