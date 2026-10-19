// [v1.3] GET /api/word/export?type=CUTEP — ดาวน์โหลดคลังคำของคอร์ส (CSV เปิดด้วย Excel ได้ ภาษาไทยไม่เพี้ยน)
// ช่อง id = รหัสคำในระบบ: เก็บไว้ในไฟล์ แล้วแก้ช่องอื่น (รวมตัวสะกด) แล้วนำเข้ากลับ = แก้คำเดิม · แถวที่ไม่มี id = คำใหม่
import { Word } from 'models'
import { apiHandler, withAuth } from 'utils'
import { COURSES, canonType } from 'libs/practice'

export default apiHandler({ get: withAuth(exportCsv, { admin: true }) })

// ช่องที่ขึ้นต้นด้วย = + @ - ใส่ ' นำหน้า (กัน Excel มองเป็นสูตร) · ตอนนำเข้าระบบตัด ' ออกให้เอง
const cell = (v) => {
  let s = String(v ?? '').replace(/[\r\n]+/g, ' ')
  if (/^[=+@\-\t]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

async function exportCsv(req, res) {
  const type = canonType(req.query.type || 'CUTEP')
  if (!COURSES.includes(type)) return res.status(400).json({ message: 'ไม่รู้จักคอร์สนี้' })
  const words = await Word.find({ types: type }).lean()
  const rows = [['id', 'word', 'pos', 'translation', 'synonym', 'types']]
  // id ขึ้นต้นด้วย # เพื่อให้ Excel เก็บเป็นข้อความ (ไม่แปลงเป็นตัวเลข)
  words.forEach((w) => rows.push([`#${w._id}`, w.word, w.pos, w.translation, w.synonym, (w.types || []).join(', ')]))
  const csv = '﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="wordmeup-words-${type}.csv"`)
  res.send(csv)
}
