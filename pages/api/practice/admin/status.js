// GET /api/practice/admin/status?type=CUTEP — แอดมินดูว่าแต่ละชุดมีเนื้อหาครบกี่ด่าน
import { apiHandler, withAuth } from 'utils'
import { getSets, loadContent, buildSet, labelOf, canonType } from 'libs/practice'
import { LP_VERSION } from 'libs/practice-version'

export default apiHandler({ get: withAuth(status, { admin: true }) })

async function status(req, res) {
  const type = canonType(req.query.type || 'CUTEP')
  const chunks = await getSets(type)
  const C = await loadContent(type)
  const sets = chunks.map((chunk, i) => {
    const s = buildSet(type, i + 1, chunk, chunks.length, C)
    const a = s.authored
    return {
      no: i + 1, first: s.words[0]?.w || '', last: s.words[s.words.length - 1]?.w || '', count: s.words.length,
      sentences: a.sentences, synonyms: a.synonyms, pos: a.pos, form: a.form,
      // ครบ = ทุกคำมีคำแปลไทย + ประโยค + คำเหมือน และมีข้อแปลงร่างของชุดเองอย่างน้อย 5 ข้อ (ถ้าไม่ครบ เกมใช้ข้อสำรองให้อัตโนมัติ)
      // คำที่ช่องคำแปล (translation) ว่าง = ไม่ครบ (การ์ดจับคู่ในเกมจะว่าง)
      noTh: s.words.filter((x) => !x.th).map((x) => x.w),
      complete: s.words.every((x) => x.th) && a.sentences === s.words.length && a.synonyms === s.words.length && a.form >= 5,
      missing: s.words.filter((x) => !x.s || !x.syn || !x.th).map((x) => x.w),
    }
  })
  // waiting = คำที่เพิ่มทีหลัง ยังไม่ครบ 10 คำ จึงยังไม่เปิดเป็นชุดใหม่
  res.json({ version: LP_VERSION, type, label: C.label || labelOf(type), total: sets.length, waiting: chunks.waiting || 0, sets })
}
