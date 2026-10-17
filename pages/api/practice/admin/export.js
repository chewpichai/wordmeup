// GET /api/practice/admin/export?type=CUTEP — ดาวน์โหลดรายการศัพท์ (CSV เปิดด้วย Excel ได้) เรียงตามชุดที่ระบบแบ่งจริง
import { apiHandler, withAuth } from 'utils'
import { getSets, loadContent, buildSet, canonType } from 'libs/practice'

export default apiHandler({ get: withAuth(exportCsv, { admin: true }) })

// ช่องที่ขึ้นต้นด้วย = + @ ใส่ ' นำหน้า (กัน Excel มองเป็นสูตร)
const cell = (v) => {
  let s = String(v ?? '').replace(/[\r\n]+/g, ' ')
  if (/^[=+@\t]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

async function exportCsv(req, res) {
  const type = canonType(req.query.type || 'CUTEP')
  const chunks = await getSets(type)
  const C = await loadContent(type)
  const rows = [['set', 'word', 'pos', 'translation', 'synonym', 'sentence', 'form_items']]
  chunks.forEach((chunk, i) => {
    const s = buildSet(type, i + 1, chunk, chunks.length, C)
    chunk.forEach((d, j) => {
      const x = s.words[j]
      const nForm = s.form.filter((f) => f.w === x.w && !f.borrowed).length
      rows.push([i + 1, x.w, d.pos, x.th, x.syn, x.s, nForm])
    })
  })
  const csv = '﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="wordmeup-practice-${type}.csv"`)
  res.send(csv)
}
