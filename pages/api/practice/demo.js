// GET /api/practice/demo — ชุดเดโมสาธารณะ (ไม่ต้อง login) = ชุดที่ 1 ของ CU-TEP จากคลังคำจริง + จำนวนชุดทั้งหมด
// หน้าเดโมใช้ไฟล์ public/practice/demo-set.json แทน ถ้าเรียก API นี้ไม่สำเร็จ · เก็บผลไว้ 5 นาที (คนเปิดจากหน้าขายเยอะได้)
import { apiHandler } from 'utils'
import { getSets, loadContent, buildSet } from 'libs/practice'

const TYPE = 'CUTEP'
const TTL = 5 * 60 * 1000
let cache = null

export default apiHandler({ get: demo })

async function demo(req, res) {
  if (!cache || Date.now() - cache.at > TTL) {
    const chunks = await getSets(TYPE)
    if (!chunks.length || chunks[0].length < 4) return res.status(404).json({ message: 'Set not found.' })
    const C = await loadContent(TYPE)
    const { authored, ...set } = buildSet(TYPE, 1, chunks[0], chunks.length, C)
    cache = { at: Date.now(), set }
  }
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.json({ set: cache.set })
}
