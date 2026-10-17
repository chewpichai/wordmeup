// GET /api/practice/admin/content?type=CUTEP — ดาวน์โหลดเนื้อหาปัจจุบัน (JSON) ทุกข้อแปลงร่างมี id
// PUT /api/practice/admin/content — อัปโหลดเนื้อหา { type, label?, words:{}, form:[], avoid?:[[..]], mode:'merge'|'replace' }
//   หรือส่งทั้งไฟล์แบบ data/practice-content.json ({ CUTEP:{...}, TOEIC:{...}, mode }) ก็ได้
//   merge   = เพิ่ม/แก้ทับของเดิม: คำ = ทับเฉพาะช่องที่ส่งมา ("s": "" = ลบประโยค) · ข้อแปลงร่าง id เดิม = แก้ข้อนั้น
//             ลบ: { "id": "abduct#1", "delete": true } หรือ words: { "abduct": { "delete": true } }
//   replace = แทนที่ทั้งหมด: เนื้อหาในไฟล์คือทั้งหมดของคอร์สนั้น (ไม่ดึงจากไฟล์ตั้งต้นอีก) ต้องมีทั้ง words และ form
import { PracticeContent, Word } from 'models'
import { apiHandler, withAuth } from 'utils'
import { loadContent, fileContent, mergeContent, canonType, formWs, formProblem, answerIndex, cleanTip, labelOf, normWord, encAvoid, decAvoid, COURSES } from 'libs/practice'

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }

export default apiHandler({
  get: withAuth(download, { admin: true }),
  put: withAuth(upload, { admin: true }),
})

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)

async function download(req, res) {
  const type = canonType(req.query.type || 'CUTEP')
  const C = await loadContent(type)
  res.json({ type, label: C.label || labelOf(type), avoid: C.avoid, words: C.words, form: C.form })
}

// สร้าง id ให้ข้อที่ไม่มี id: ถ้าประโยคตรงกับข้อในไฟล์ตั้งต้น ใช้ id เดิม · ไม่งั้นสร้างจากคำ + ประโยค (ได้ค่าเดิมทุกครั้ง)
function hashId(w, s) {
  let h = 5381
  for (const ch of `${w}|${s}`) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0
  return `${normWord(w)}#u${h.toString(36)}`
}

function clean(type, raw, known, mode) {
  const errors = []
  const warnings = []
  if (raw.words != null && !isObj(raw.words)) errors.push(`${type}: words ต้องเป็น { "คำ": { "s": "...", "syn": "..." } }`)
  if (raw.form != null && !Array.isArray(raw.form)) errors.push(`${type}: form ต้องเป็นรายการ [ {...}, {...} ]`)
  if (raw.avoid != null && !Array.isArray(raw.avoid)) errors.push(`${type}: avoid ต้องเป็นรายการ [ ["คำ1","คำ2"], ... ]`)
  if (mode === 'replace' && (raw.words == null || raw.form == null))
    errors.push(`${type}: โหมด "แทนที่ทั้งหมด" ต้องมีทั้ง words และ form ในไฟล์ (กด "ดาวน์โหลดเนื้อหาปัจจุบัน" แล้วแก้จากไฟล์นั้น)`)
  if (errors.length) return { errors, warnings, words: {}, form: [], avoid: null }

  const words = {}
  Object.entries(raw.words || {}).forEach(([w, v]) => {
    const key = String(w).trim()
    if (!key || key.includes('.') || key[0] === '$') return errors.push(`${type} · "${w}": ชื่อคำห้ามว่าง ห้ามมีจุด (.) และห้ามขึ้นต้นด้วย $`)
    if (!isObj(v)) return errors.push(`${type} · ${key}: ต้องเป็น { "s": "...", "syn": "..." }`)
    if (!known.has(normWord(key))) warnings.push(`${type} · ${key}: ไม่พบคำนี้ในคลังคำของคอร์ส (จะไม่แสดงจนกว่าจะเพิ่มคำนี้)`)
    if (v.delete === true) { words[key] = { delete: true }; return }
    const item = {}
    if ('s' in v) {
      const s = v.s == null ? '' : String(v.s).trim()
      if (s && (s.match(/___/g) || []).length !== 1) return errors.push(`${type} · ${key}: ประโยคต้องมีช่องว่าง ___ 1 ช่องพอดี`)
      item.s = s // "" = ลบประโยคของคำนี้ (เกมใช้ข้อสำรองแทน)
    }
    if ('syn' in v) item.syn = v.syn == null ? '' : String(v.syn).trim()
    if (Object.keys(item).length) words[key] = item
  })

  const baseIds = new Map(mergeContent(fileContent(type), null).form.map((f) => [formWs(f), f.id]))
  const form = []
  const seen = new Set()
  ;(raw.form || []).forEach((f, i) => {
    const where = `${type} · form #${i + 1}${f && f.w ? ` (${f.w})` : ''}`
    if (isObj(f) && f.delete === true) {
      const id = typeof f.id === 'string' && f.id.trim() ? f.id.trim() : (f.w && f.s ? baseIds.get(formWs(f)) || hashId(f.w, String(f.s).trim()) : '')
      if (!id) return errors.push(`${where}: ข้อที่จะลบต้องมี id (หรือ w + s)`)
      form.push({ id, delete: true })
      return
    }
    const p = formProblem(f)
    if (p) return errors.push(`${where}: ${p}`)
    const w = f.w.trim()
    const s = f.s.trim()
    if (!known.has(normWord(w))) warnings.push(`${where}: ไม่พบคำนี้ในคลังคำของคอร์ส`)
    const id = typeof f.id === 'string' && f.id.trim() ? f.id.trim().slice(0, 120) : (baseIds.get(formWs({ w, s })) || hashId(w, s))
    if (seen.has(id)) return errors.push(`${where}: id "${id}" ซ้ำกับข้ออื่นในไฟล์`)
    seen.add(id)
    const tip = cleanTip(f.tip)
    if (f.tip && tip !== String(f.tip)) warnings.push(`${where}: คำอธิบายมีโค้ด/แท็กที่ไม่อนุญาต ระบบตัดออกแล้ว (ใช้ได้แค่ <b> <i> <br> <span>)`)
    form.push({ id, w, s, o: f.o.map((x) => String(x).trim()), a: answerIndex(f.a), tip })
  })
  const avoid = Array.isArray(raw.avoid) ? encAvoid(raw.avoid.filter((g) => Array.isArray(g) || typeof g === 'string')) : null
  return { words, form, avoid, errors, warnings }
}

async function upload(req, res) {
  const b = req.body
  if (!isObj(b)) return res.status(400).json({ message: 'ไฟล์ไม่ใช่เนื้อหา Let\'s Practice' })
  const mode = b.mode === 'replace' ? 'replace' : 'merge'
  // รองรับ 2 แบบ: {type, words, form} หรือ {CUTEP:{...}, TOEIC:{...}}
  const packs = b.type != null ? [[b.type, b]] : Object.entries(b).filter(([k, v]) => k[0] !== '_' && k !== 'mode' && isObj(v))
  if (!packs.length) return res.status(400).json({ message: 'ไม่พบเนื้อหาในไฟล์' })
  const allErrors = []
  const cleaned = []
  for (const [t, raw] of packs) {
    const type = canonType(typeof t === 'string' ? t : '')
    if (!COURSES.includes(type)) { allErrors.push(`${String(t)}: ไม่รู้จักคอร์สนี้ (ใช้ CUTEP / TOEIC / IELTS)`); continue }
    const docs = await Word.find({ types: type }).select('word').lean()
    const known = new Set(docs.map((d) => normWord(d.word)))
    const c = clean(type, raw, known, mode)
    allErrors.push(...c.errors)
    cleaned.push({ type, label: typeof raw.label === 'string' ? raw.label.trim() : '', ...c })
  }
  if (allErrors.length) return res.status(400).json({ message: 'ไฟล์มีจุดที่ต้องแก้ ยังไม่ได้บันทึก', errors: allErrors.slice(0, 50) })
  const report = []
  for (const c of cleaned) {
    let doc = await PracticeContent.findOne({ type: c.type })
    if (!doc) doc = new PracticeContent({ type: c.type })
    if (mode === 'replace') {
      doc.mode = 'replace'
      doc.words = Object.fromEntries(Object.entries(c.words).filter(([, v]) => !v.delete))
      doc.form = c.form.filter((f) => !f.delete)
      doc.avoid = c.avoid || []
    } else {
      const full = doc.mode === 'replace' // เนื้อหาทั้งหมดอยู่ในฐานข้อมูลแล้ว → ลบได้จริง ไม่ต้องเก็บรายการลบไว้
      const words = { ...(doc.words || {}) }
      const keyOf = {}
      Object.keys(words).forEach((k) => { keyOf[normWord(k)] = k })
      Object.entries(c.words).forEach(([k, v]) => {
        const old = keyOf[normWord(k)]
        const cur = old && !words[old].delete ? words[old] : {}
        if (old) delete words[old]
        if (v.delete) { if (!full) words[k] = { delete: true } } else words[k] = { ...cur, ...v }
        keyOf[normWord(k)] = k
      })
      doc.words = words
      const map = new Map((doc.form || []).map((f) => [f.id || `ws:${formWs(f)}`, f]))
      c.form.forEach((f) => {
        if (f.delete && full) map.delete(f.id)
        else map.set(f.id, f)
      })
      doc.form = [...map.values()]
      if (c.avoid) doc.avoid = c.avoid
    }
    if (c.label) doc.label = c.label
    doc.updatedBy = req.me.username
    doc.markModified('words')
    doc.markModified('form')
    doc.markModified('avoid')
    await doc.save()
    const eff = mergeContent(fileContent(c.type), doc.toObject())
    report.push({
      type: c.type,
      mode,
      words: Object.keys(c.words).length,
      form: c.form.filter((f) => !f.delete).length,
      deleted: c.form.filter((f) => f.delete).length + Object.values(c.words).filter((v) => v.delete).length,
      totalForm: eff.form.length,
      totalAvoid: decAvoid(eff.avoid).length,
      warnings: c.warnings.slice(0, 30),
      warningCount: c.warnings.length,
    })
  }
  res.json({ ok: true, mode, report })
}
