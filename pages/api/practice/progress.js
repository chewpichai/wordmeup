// PUT /api/practice/progress — บันทึกผล (รวมกับของเดิม: ดาวเก็บค่าสูงสุด, สมุดคำศัพท์รวมกัน, ไม่มีทางลดลง)
// บันทึกแบบ atomic ($max / $addToSet) — กดเร็ว/เปิด 2 เครื่องพร้อมกัน/บันทึกซ้อนกัน ดาวไม่หาย และบันทึกครั้งแรกไม่ error 500
// XP: เกมส่ง "ก้อน XP ที่ได้เพิ่ม" xg:[{ id, g }] · server บวกแต่ละ id ครั้งเดียว (ส่งซ้ำ/ส่งจาก 2 เครื่อง ไม่บวกซ้ำ ไม่หาย)
// ผลการเล่นมาจากเบราว์เซอร์ (ไม่มีกระดานคะแนน) · server กันค่าเกินจริง: ดาว 0-3 · เปิดชุดตามลำดับ · XP จำกัดต่อก้อน
import { PracticeProgress } from 'models'
import { apiHandler, withAuth } from 'utils'
import { getSets, setKey, isUnlocked, resolveType, STAGE_IDS } from 'libs/practice'

export default apiHandler({ put: withAuth(save) })

const MAX_XP_PER_GAIN = 400 // 1 ด่านได้ XP ไม่เกินประมาณ 250 · กันการยิง XP มั่ว
const MAX_GAINS = 10 // ต่อ 1 ครั้งที่บันทึก
const ID_RE = /^[A-Za-z0-9_-]{6,40}$/

async function save(req, res) {
  const b = req.body
  if (!b || typeof b !== 'object' || Array.isArray(b)) return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง' })
  const type = resolveType(req)
  const user = req.me._id
  let prog = await PracticeProgress.findOne({ user }).lean()
  if (!prog) {
    // สร้างเอกสารครั้งแรก · unique index { user: 1 } กันเอกสารซ้ำ (mongoose สร้างให้ตอนเปิด server · สั่งซ้ำตรงนี้เผื่อ autoIndex ปิด/collection ถูกสร้างใหม่ ถ้ามีอยู่แล้วไม่ทำอะไร)
    // ถ้ามีคำขออื่นสร้างไปพร้อมกันแล้ว (duplicate key) ก็ใช้ของที่มีอยู่
    await PracticeProgress.createIndexes().catch(() => {})
    try {
      await PracticeProgress.create({ user })
    } catch (e) {
      if (e.code !== 11000) throw e
    }
    prog = await PracticeProgress.findOne({ user }).lean()
  }

  const $set = {}
  const $max = {}
  const $addToSet = {}
  if (b.toured === true) $set.toured = true
  if (b.seen && typeof b.seen === 'object') STAGE_IDS.forEach((id) => { if (b.seen[id] === true || b.seen[id] === 1) $set[`seen.${id}`] = true })

  const no = typeof b.no === 'number' || typeof b.no === 'string' ? parseInt(b.no, 10) : NaN
  if (no) {
    const chunks = await getSets(type)
    if (!(no >= 1 && no <= chunks.length)) return res.status(404).json({ message: 'Set not found.' })
    if (!isUnlocked(prog, type, no, req.me.isAdmin, chunks)) return res.status(403).json({ message: 'Set locked.' })
    const key = setKey(type, no)
    if (b.stars && typeof b.stars === 'object') {
      STAGE_IDS.forEach((id) => {
        const v = b.stars[id]
        if (typeof v === 'number' && Number.isFinite(v)) $max[`sets.${key}.stars.${id}`] = Math.max(0, Math.min(3, Math.round(v))) // ดาว 0-3 เท่านั้น
      })
    }
    const valid = new Set(chunks[no - 1].map((d) => String(d.word).trim()))
    const got = Array.isArray(b.got) ? [...new Set(b.got.filter((w) => typeof w === 'string' && valid.has(w)))] : []
    $addToSet[`sets.${key}.got`] = { $each: got } // รวมกับของเดิม ไม่ทับ
  }

  const update = {}
  if (Object.keys($set).length) update.$set = $set
  if (Object.keys($max).length) update.$max = $max
  if (Object.keys($addToSet).length) update.$addToSet = $addToSet
  if (Object.keys(update).length) await PracticeProgress.updateOne({ user }, update)

  // XP ทีละก้อน: บวกเฉพาะ id ที่ยังไม่เคยบวก (เงื่อนไขกับการบวกอยู่ในคำสั่งเดียวกัน = atomic)
  const gains = (Array.isArray(b.xg) ? b.xg : []).slice(0, MAX_GAINS)
    .filter((x) => x && typeof x.id === 'string' && ID_RE.test(x.id) && Number.isInteger(x.g) && x.g > 0 && x.g <= MAX_XP_PER_GAIN)
  const seenIds = new Set()
  for (const x of gains) {
    if (seenIds.has(x.id)) continue
    seenIds.add(x.id)
    await PracticeProgress.updateOne({ user, xpIds: { $ne: x.id } }, { $inc: { xp: x.g }, $addToSet: { xpIds: x.id } })
  }
  const doc = await PracticeProgress.findOne({ user }).select('xp').lean()
  res.json({ ok: true, xp: (doc && doc.xp) || 0 })
}
