import { User, PracticeProgress } from 'models'
import { apiHandler, withAuth, publicUser } from 'utils'

// [security patch] แก้ได้เฉพาะบัญชีตัวเอง (หรือ admin) · นักเรียนแก้ได้แค่ field ที่ควรแก้ · ลบ = admin เท่านั้น
const STUDENT_FIELDS = ['numPerDay', 'showHowto']
const MAX_PER_DAY = 100

// ตรวจค่าที่แก้ได้: numPerDay = จำนวนเต็ม 1-100 (0 หรือช่องว่าง = ยังไม่ตั้ง เหมือนระบบเดิม · ติดลบ = 1) · showHowto = true/false
function checkFields(body) {
  const out = {}
  if ('numPerDay' in body) {
    const v = body.numPerDay
    const empty = v === '' || v === null || v === undefined
    const n = empty ? 0 : typeof v === 'number' || typeof v === 'string' ? Number(v) : NaN
    if (!Number.isFinite(n)) return { error: 'จำนวนคำต่อวันต้องเป็นตัวเลข' }
    out.numPerDay = empty || n === 0 ? 0 : Math.min(MAX_PER_DAY, Math.max(1, Math.round(n)))
  }
  if ('showHowto' in body) {
    if (typeof body.showHowto !== 'boolean') return { error: 'showHowto ต้องเป็น true/false' }
    out.showHowto = body.showHowto
  }
  return { out }
}

export default apiHandler({
  put: withAuth(update, { owner: true }),
  delete: withAuth(_delete, { admin: true }),
});

async function update(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const user = await User.findById(req.query.uid)
  if (!user) return res.status(404).end('Not found')
  if (body.finish) {
    user.numRounds += 1
  } else {
    const { out, error } = checkFields(body)
    if (error) return res.status(400).json({ message: error })
    if (req.me.isAdmin) Object.keys(body).map(k => user[k] = body[k])
    else STUDENT_FIELDS.forEach(k => { if (k in body) user[k] = body[k] })
    Object.assign(user, out)
  }
  await user.save()
  res.json(req.me.isAdmin ? user : publicUser(user))
}

async function _delete(req, res) {
  const user = await User.findById(req.query.uid)
  if (user) {
    await User.deleteOne({ _id: user._id })
    // [Let's Practice] ลบความคืบหน้า Let's Practice ของคนนั้นด้วย
    await PracticeProgress.deleteOne({ user: user._id })
  }
  res.json(user)
}
