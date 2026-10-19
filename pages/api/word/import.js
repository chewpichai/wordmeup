// [v1.3] นำเข้าคลังคำจากไฟล์ Excel/CSV ทีเดียว (Admin → Word)
// POST { rows:[{line,id?,word,pos,translation,synonym,types?}], type, file, apply:false } → ดูตัวอย่าง (ยังไม่แก้อะไร)
// POST { ...เหมือนเดิม, apply:true }                                              → เพิ่ม/แก้จริง + บันทึกค่าเดิมไว้ย้อนกลับ
// POST { undo:true }                                                               → ย้อนการนำเข้าครั้งล่าสุด
// ลบได้เฉพาะคำซ้ำที่ระบุ "ลบ" ในไฟล์ (ดู libs/word-import.js) · ไม่ถอดคอร์สออกจากคำ · ไม่แตะข้อมูลนักเรียน
// คำที่แก้ยังอยู่ชุด Let's Practice เดิม (ผูกกับ _id)
import mongoose from 'mongoose'
import { Word, User, WordImportLog } from 'models'
import { apiHandler, withAuth } from 'utils'
import { planImport, MAX_ROWS } from 'libs/word-import'

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }
export default apiHandler({ post: withAuth(run, { admin: true }) })

async function run(req, res) {
  const b = req.body && typeof req.body === 'object' ? req.body : {}
  if (b.undo === true) return undo(req, res)
  const rows = Array.isArray(b.rows) ? b.rows : null
  if (!rows || !rows.length) return res.status(400).json({ message: 'ไม่พบแถวคำศัพท์ในไฟล์' })
  if (rows.length > MAX_ROWS) return res.status(400).json({ message: `ไฟล์มีเกิน ${MAX_ROWS} แถว แบ่งเป็นหลายไฟล์แล้วนำเข้าทีละไฟล์` })
  const docs = await Word.find().lean()
  const plan = planImport(rows, docs, typeof b.type === 'string' ? b.type : '')
  // แถวเสียเกินครึ่ง = น่าจะผิดไฟล์ / คอลัมน์สลับ / ภาษาไทยเสีย → ไม่ทำอะไรเลย
  if (plan.rows >= 6 && plan.errors.length > plan.rows / 2)
    return res.status(400).json({ message: `แถวที่มีปัญหา ${plan.errors.length} จาก ${plan.rows} แถว · ไฟล์อาจผิด คอลัมน์สลับ หรือภาษาไทยเสีย (แนะนำบันทึกเป็น .xlsx หรือ CSV UTF-8) · ยังไม่ได้แก้อะไร`, errors: plan.errors.slice(0, 30) })
  if (b.apply !== true) return res.json({ preview: true, ...plan })

  if (!plan.add.length && !plan.update.length && !plan.remove.length) return res.json({ applied: true, added: 0, updated: 0, removed: 0, unchanged: plan.unchanged, errors: plan.errors.length })
  const delIds = plan.remove.map((x) => new mongoose.Types.ObjectId(x._id))
  const delDocs = delIds.length ? await Word.find({ _id: { $in: delIds } }).lean() : []
  const log = await WordImportLog.create({
    by: req.me.username,
    file: typeof b.file === 'string' ? b.file.slice(0, 200) : '',
    updated: plan.update.map((u) => ({ _id: u._id, before: u.before, after: u.after })),
    deleted: delDocs,
  })
  if (delIds.length) await Word.deleteMany({ _id: { $in: delIds } })
  // แก้ทีละ 50 คำต่อครั้ง (ไม่ส่งคำสั่งก้อนใหญ่ครั้งเดียว)
  for (let i = 0; i < plan.update.length; i += 50)
    await Word.bulkWrite(plan.update.slice(i, i + 50).map((u) => ({ updateOne: { filter: { _id: new mongoose.Types.ObjectId(u._id) }, update: { $set: u.after } } })))
  if (plan.add.length) {
    const docs = plan.add.map(({ line, ...doc }) => doc)
    const made = []
    for (let i = 0; i < docs.length; i += 50) made.push(...await Word.insertMany(docs.slice(i, i + 50)))
    log.created = made.map((d) => d._id)
    await log.save()
  }
  res.json({ applied: true, added: plan.add.length, updated: plan.update.length, removed: delDocs.length, unchanged: plan.unchanged, errors: plan.errors.length })
}

async function undo(req, res) {
  const log = await WordImportLog.findOne({ undone: false }).sort({ createdAt: -1 })
  if (!log) return res.status(404).json({ message: 'ไม่มีการนำเข้าที่ย้อนกลับได้' })
  // คืนค่าเดิมเฉพาะช่องที่ยังเป็นค่าที่นำเข้า (ถ้าแอดมินแก้ต่อแล้ว จะไม่ทับ)
  const ids = log.updated.map((u) => new mongoose.Types.ObjectId(u._id))
  const now = new Map((await Word.find({ _id: { $in: ids } }).lean()).map((d) => [String(d._id), d]))
  let reverted = 0
  for (const u of log.updated) {
    const d = now.get(String(u._id))
    if (!d) continue
    const back = {}
    Object.keys(u.after).forEach((k) => {
      if (k === 'types') { if (JSON.stringify(d.types) === JSON.stringify(u.after.types)) back.types = u.before.types }
      else if (String(d[k] ?? '') === String(u.after[k] ?? '')) back[k] = u.before[k]
    })
    if (Object.keys(back).length) { await Word.updateOne({ _id: d._id }, { $set: back }); reverted++ }
  }
  // คำที่เพิ่มใหม่: ลบออก ยกเว้นคำที่นักเรียนมีในรายการท่องแล้ว (เก็บไว้ ไม่ให้ข้อมูลนักเรียนเสีย)
  let removed = 0
  let kept = 0
  for (const id of log.created) {
    if (await User.exists({ 'words.word': id })) { kept++; continue }
    const r = await Word.deleteOne({ _id: id })
    removed += r.deletedCount || 0
  }
  // คำซ้ำที่ลบไป: ใส่คืนด้วย _id เดิม (รายการท่องของนักเรียนที่อ้างถึงคำนั้นกลับมาใช้ได้)
  let restored = 0
  for (const d of log.deleted || []) {
    if (await Word.exists({ _id: d._id })) continue
    await Word.collection.insertOne(d)
    restored++
  }
  log.undone = true
  await log.save()
  res.json({ undone: true, reverted, removed, kept, restored })
}
