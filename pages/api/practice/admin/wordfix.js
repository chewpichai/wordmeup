// แก้คลังคำทีเดียวจากไฟล์ที่ตรวจแล้ว (Admin → Practice → แก้คลังคำ)
// POST { fixes:[{type, word, expect:{...}, set:{...}, why}], apply:false } → ดูตัวอย่างก่อน (ไม่แก้อะไร)
// POST { fixes, apply:true }                                           → แก้จริง + บันทึกค่าเดิมไว้ย้อนกลับ
// POST { undo:true }                                                   → ย้อนการแก้ครั้งล่าสุด
// ความปลอดภัย: แก้แต่ละช่องก็ต่อเมื่อค่าปัจจุบันยังตรงกับค่าเดิมที่ตรวจไว้ · ไม่ลบ/ไม่เพิ่มคำ · ไม่แตะข้อมูลนักเรียน
// คำที่แก้ตัวสะกดยังอยู่ชุดเดิม (ลำดับชุดผูกกับ _id ของคำ) · ถ้ายังไม่มีนักเรียนคนไหนเล่น Let's Practice เลย
// ระบบจะเรียงชุดใหม่ a→z ตามตัวสะกดที่แก้แล้วให้เอง
import mongoose from 'mongoose'
import { Word, WordFixLog, PracticeProgress, PracticeOrder } from 'models'
import { apiHandler, withAuth } from 'utils'
import { canonType } from 'libs/practice'

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }
export default apiHandler({ post: withAuth(run, { admin: true }) })

const FIELDS = ['word', 'pos', 'translation', 'synonym']
const REQUIRED = ['word', 'pos', 'translation'] // ห้ามแก้เป็นค่าว่าง
const same = (a, b) => String(a ?? '').trim() === String(b ?? '').trim()
const str = (v) => typeof v === 'string' || typeof v === 'number'

// ยังไม่มีใครเล่น → ล้างลำดับชุดของคอร์สที่แก้ (ครั้งหน้าระบบเรียง a→z ใหม่จากตัวสะกดที่ถูก)
async function resetOrderIfUnused(types) {
  if (await PracticeProgress.countDocuments({})) return false
  await PracticeOrder.deleteMany({ type: { $in: types } })
  return true
}

async function run(req, res) {
  const b = req.body || {}
  if (b.undo === true) return undo(req, res)
  const input = Array.isArray(b.fixes) ? b.fixes : []
  const skipped = []
  const fixes = []
  input.forEach((f) => {
    if (!f || typeof f !== 'object' || !str(f.type) || !str(f.word) || !f.set || typeof f.set !== 'object' || Array.isArray(f.set)) return
    const blank = REQUIRED.filter((k) => k in f.set && !String(f.set[k] ?? '').trim())
    if (blank.length) { skipped.push(`${f.type} · ${f.word}: ค่าใหม่ของ ${blank.join(', ')} ว่าง (ข้าม)`); return }
    const set = {}
    FIELDS.forEach((k) => { if (k in f.set && str(f.set[k])) set[k] = String(f.set[k]).trim() })
    const expect = {}
    if (f.expect && typeof f.expect === 'object') FIELDS.forEach((k) => { if (k in f.expect) expect[k] = f.expect[k] })
    if (Object.keys(set).length) fixes.push({ type: canonType(f.type), word: String(f.word), set, expect, why: str(f.why) ? String(f.why) : '' })
  })
  if (!fixes.length) return res.status(400).json({ message: 'ไม่พบรายการแก้ในไฟล์', skipped })
  // โหลดคลังคำของคอร์สที่เกี่ยวข้องครั้งเดียว แล้วจับคู่ในหน่วยความจำ (เร็ว)
  const types = [...new Set(fixes.map((f) => f.type))]
  const all = await Word.find({ types: { $in: types } }).lean()
  const key = (t, w) => `${t}|${String(w || '').trim().toLowerCase()}`
  const idx = new Map()
  all.forEach((d) => (d.types || []).forEach((t) => { const k = key(t, d.word); if (!idx.has(k)) idx.set(k, []); idx.get(k).push(d) }))
  const plan = []
  const touched = new Set()
  let already = 0
  for (const f of fixes) {
    const expect = f.expect
    const doneRow = (d) => Object.keys(f.set).every((k) => same(d[k], f.set[k]))
    // แก้ไปแล้ว (เช่นเปลี่ยนตัวสะกดแล้ว) → ไม่ต้องทำอะไร
    if (f.set.word && (idx.get(key(f.type, f.set.word)) || []).some(doneRow)) { already++; continue }
    let docs = (idx.get(key(f.type, f.word)) || []).filter((d) => !touched.has(String(d._id)))
    if (!docs.length) { skipped.push(`${f.type} · ${f.word}: ไม่พบคำนี้ในคลัง`); continue }
    const exact = docs.filter((d) => Object.keys(expect).every((k) => same(d[k], expect[k])))
    if (exact.length) docs = exact
    else if (docs.some(doneRow)) { already++; continue }
    else if (docs.length > 1) { skipped.push(`${f.type} · ${f.word}: ค่าในระบบถูกแก้ไปแล้ว (ข้าม ไม่ทับ)`); continue }
    for (const d of docs) {
      const after = {}
      let rowSkipped = false
      for (const k of FIELDS) {
        if (!(k in f.set) || same(d[k], f.set[k])) continue
        if (k in expect && !same(d[k], expect[k])) { skipped.push(`${f.type} · ${d.word} · ${k}: ค่าในระบบถูกแก้ไปแล้ว (ข้าม ไม่ทับ)`); rowSkipped = true; continue }
        if (k === 'word' && (idx.get(key(f.type, f.set.word)) || []).some((x) => String(x._id) !== String(d._id))) {
          skipped.push(`${f.type} · ${d.word}: มีคำ "${f.set.word}" อยู่แล้ว (ข้ามการแก้ตัวสะกด)`); rowSkipped = true; continue
        }
        after[k] = f.set[k]
      }
      if (!Object.keys(after).length) { if (!rowSkipped) already++; continue }
      touched.add(String(d._id))
      plan.push({ _id: String(d._id), type: f.type, before: Object.fromEntries(FIELDS.map((k) => [k, d[k]])), after, why: f.why })
    }
  }
  if (b.apply !== true) return res.json({ preview: true, count: plan.length, already, skipped, items: plan })
  let reordered = false
  if (plan.length) {
    await WordFixLog.create({ by: req.me.username, items: plan })
    for (const p of plan) await Word.updateOne({ _id: new mongoose.Types.ObjectId(p._id) }, { $set: p.after })
    reordered = await resetOrderIfUnused(types)
  }
  res.json({ applied: true, count: plan.length, already, skipped, reordered })
}

async function undo(req, res) {
  const log = await WordFixLog.findOne({ undone: false }).sort({ createdAt: -1 })
  if (!log) return res.status(404).json({ message: 'ไม่มีการแก้ที่ย้อนกลับได้' })
  const ids = log.items.map((p) => new mongoose.Types.ObjectId(p._id))
  const now = new Map((await Word.find({ _id: { $in: ids } }).lean()).map((d) => [String(d._id), d]))
  const ops = []
  for (const p of log.items) {
    const d = now.get(String(p._id))
    if (!d) continue
    const back = {}
    for (const k of Object.keys(p.after)) if (same(d[k], p.after[k])) back[k] = p.before[k]
    if (Object.keys(back).length) ops.push([d._id, back])
  }
  for (const [id, back] of ops) await Word.updateOne({ _id: id }, { $set: back })
  const n = ops.length
  log.undone = true
  await log.save()
  const reordered = n ? await resetOrderIfUnused([...new Set(log.items.map((p) => p.type))]) : false
  res.json({ undone: true, count: n, reordered })
}
