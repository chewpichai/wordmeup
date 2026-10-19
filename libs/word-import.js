// [v1.3] นำเข้าคลังคำจากไฟล์ (Admin → Word): ตรวจแถว → จับคู่กับคำในระบบ → สรุปว่าจะเพิ่ม/แก้/ลบอะไร
// ใช้ฝั่ง server · ไม่ถอดคอร์สออกจากคำ
// ลบ: เฉพาะแถวที่ช่อง delete = "ลบ" และต้องเป็น "คำซ้ำ" (คำเดียวกันในคอร์สเดียวกันยังเหลืออีกอย่างน้อย 1 แถว)
//     ต้องตรงทุกช่อง (word, pos, translation และ synonym ถ้าใส่) หรือระบุ id · ลบคำทั่วไปยังใช้ปุ่มถังขยะทีละคำเหมือนเดิม
import { COURSES, canonType } from 'libs/practice'

export const FIELDS = ['word', 'pos', 'translation', 'synonym']
export const MAX_ROWS = 5000
const LIMIT = { word: 80, pos: 30, translation: 600, synonym: 600 }
const THAI = /[฀-๿]/

// ล้างค่าในช่อง: ตัด ' ที่ Excel/ไฟล์ส่งออกใส่กันสูตร · ยุบช่องว่าง · แก้สระอำที่พิมพ์แยก (ํา → ำ)
export function clean(v) {
  let s = typeof v === 'string' || typeof v === 'number' ? String(v) : '' // รับเฉพาะข้อความ/ตัวเลข
  if (/^'[=+@\-]/.test(s)) s = s.slice(1)
  return s.replace(/ํา/g, 'ำ').replace(/[ \s]+/g, ' ').trim()
}
const same = (a, b) => clean(a) === clean(b)
const isDel = (v) => /^(ลบ|delete|del|remove|yes|y|x|1|true)$/i.test(clean(v))
const key = (t, w) => `${t}|${clean(w).toLowerCase()}`

function parseTypes(raw, fallback) {
  const parts = clean(raw).split(/[,;/|\s]+/).filter(Boolean).map(canonType)
  const list = parts.length ? parts : fallback ? [canonType(fallback)] : []
  return [...new Set(list)]
}

// ระยะห่างตัวสะกด (ไว้เตือนว่าคำใหม่อาจเป็นคำเดิมที่สะกดต่างกัน)
function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[a.length][b.length]
}

// rows: [{ line, id?, word, pos, translation, synonym?, types? }] จากหน้าเว็บ · docs: คำทั้งหมดในระบบ (lean)
export function planImport(rows, docs, fallbackType) {
  const errors = []
  const warnings = []
  const good = []
  const seen = new Map()
  let total = 0
  ;(Array.isArray(rows) ? rows : []).slice(0, MAX_ROWS).forEach((r, i) => {
    const line = Number.isInteger(r && r.line) ? r.line : i + 2
    if (!r || typeof r !== 'object') return errors.push({ line, word: '', msg: 'แถวนี้อ่านไม่ได้' })
    const v = {}
    FIELDS.forEach((k) => { v[k] = clean(r[k]) })
    const w = v.word || '(ไม่มีคำ)'
    if (!v.word && !v.pos && !v.translation && !v.synonym) return // แถวว่าง ข้ามเงียบๆ
    total++
    const miss = ['word', 'pos', 'translation'].filter((k) => !v[k])
    if (miss.length) return errors.push({ line, word: w, msg: `ช่อง ${miss.join(', ')} ว่าง` })
    const long = FIELDS.filter((k) => v[k].length > LIMIT[k])
    if (long.length) return errors.push({ line, word: w, msg: `ช่อง ${long.join(', ')} ยาวเกินไป` })
    if (THAI.test(v.word)) return errors.push({ line, word: w, msg: 'ช่อง word มีภาษาไทย (คอลัมน์สลับกันหรือไม่?)' })
    if (!THAI.test(v.translation)) return errors.push({ line, word: w, msg: 'ช่อง translation ไม่มีภาษาไทย (คอลัมน์สลับ หรือไฟล์บันทึกแล้วภาษาไทยเสีย)' })
    if (THAI.test(v.synonym)) return errors.push({ line, word: w, msg: 'ช่อง synonym มีภาษาไทย (คอลัมน์สลับกันหรือไม่?)' })
    const types = parseTypes(r.types, fallbackType)
    const bad = types.filter((t) => !COURSES.includes(t))
    if (!types.length) return errors.push({ line, word: w, msg: 'ไม่ได้ระบุคอร์ส (types)' })
    if (bad.length) return errors.push({ line, word: w, msg: `ไม่รู้จักคอร์ส ${bad.join(', ')} (ใช้ CUTEP, TOEIC, IELTS)` })
    let id = clean(r.id).replace(/^#/, '')
    if (id && !/^[0-9a-fA-F]{24}$/.test(id)) return errors.push({ line, word: w, msg: 'ช่อง id ไม่ถูกต้อง (ลบช่อง id ออกได้ถ้าเป็นคำใหม่)' })
    const del = isDel(r.delete)
    const sig = [types.join(','), ...FIELDS.map((k) => v[k].toLowerCase()), id.toLowerCase(), del ? 'del' : ''].join('\u0001')
    if (seen.has(sig) && !del) return warnings.push({ line, word: w, msg: `แถวซ้ำกับแถว ${seen.get(sig)} ในไฟล์ (ข้าม)` })
    seen.set(sig, line)
    good.push({ line, id: id.toLowerCase(), types, v, del })
  })

  const byId = new Map(docs.map((d) => [String(d._id).toLowerCase(), d]))
  const idx = new Map()
  docs.forEach((d) => (d.types || []).forEach((t) => {
    const k = key(canonType(t), d.word)
    if (!idx.has(k)) idx.set(k, [])
    idx.get(k).push(d)
  }))
  const claimed = new Set()
  const match = new Map() // line → doc
  const score = (d, v) => FIELDS.filter((k) => same(d[k], v[k])).length
  const cands = (g) => {
    const out = []
    g.types.forEach((t) => (idx.get(key(t, g.v.word)) || []).forEach((d) => { if (!out.includes(d)) out.push(d) }))
    return out
  }
  // 0) แถวลบ (คำซ้ำ) ก่อน: ต้องตรงทุกช่องหรือระบุ id และต้องเหลือคำเดียวกันในคอร์สนั้นอย่างน้อย 1 แถว
  const remove = []
  const gone = new Set()
  good.filter((g) => g.del).forEach((g) => {
    const exact = (x) => same(x.word, g.v.word) && same(x.pos, g.v.pos) && same(x.translation, g.v.translation) && (!g.v.synonym || same(x.synonym, g.v.synonym))
    const d = g.id ? byId.get(g.id) : cands(g).find((x) => !claimed.has(String(x._id)) && exact(x))
    if (!d) return warnings.push({ line: g.line, word: g.v.word, msg: 'แถว "ลบ": ไม่พบแถวในระบบที่ตรงทุกช่อง (อาจลบไปแล้ว) · ข้าม ไม่ลบอะไร' })
    if (claimed.has(String(d._id))) return errors.push({ line: g.line, word: g.v.word, msg: 'ลบไม่ได้: แถวนี้ถูกใช้กับแถวอื่นในไฟล์แล้ว' })
    const left = docs.filter((x) => x !== d && !gone.has(String(x._id)) && same(x.word, d.word) && (x.types || []).some((t) => (d.types || []).includes(t)))
    if (!left.length) return warnings.push({ line: g.line, word: g.v.word, msg: 'แถว "ลบ": คำนี้เหลือแถวเดียวในคอร์สแล้ว จึงไม่ลบ (ลบได้เฉพาะคำซ้ำ · ถ้าจะลบจริงให้ใช้ปุ่มถังขยะ)' })
    claimed.add(String(d._id)); gone.add(String(d._id))
    remove.push({ line: g.line, _id: String(d._id), word: d.word, pos: d.pos, translation: d.translation, synonym: d.synonym || '', types: d.types || [] })
  })
  // 1) แถวที่มี id (ไฟล์ที่ดาวน์โหลดจากหน้านี้)
  good.filter((g) => g.id && !g.del).forEach((g) => {
    const d = byId.get(g.id)
    if (!d) return errors.push({ line: g.line, word: g.v.word, msg: 'ไม่พบ id นี้ในระบบ (คำอาจถูกลบไปแล้ว)' })
    if (claimed.has(String(d._id))) return errors.push({ line: g.line, word: g.v.word, msg: 'id นี้ซ้ำกับแถวก่อนหน้า' })
    claimed.add(String(d._id)); match.set(g.line, d)
  })
  const rest = good.filter((g) => !g.id && !g.del && !errors.some((e) => e.line === g.line))
  // 2) ไม่มี id: จับคู่ตามคำ + คอร์ส · รอบแรกจับคู่แถวที่ตรงทุกช่องก่อน (คำซ้ำหลายความหมายจะไม่สลับกัน)
  rest.forEach((g) => {
    const d = cands(g).find((x) => !claimed.has(String(x._id)) && score(x, g.v) === FIELDS.length)
    if (d) { claimed.add(String(d._id)); match.set(g.line, d) }
  })
  rest.filter((g) => !match.has(g.line)).forEach((g) => {
    const free = cands(g).filter((x) => !claimed.has(String(x._id)))
    if (!free.length) return
    const d = free.reduce((a, b) => (score(b, g.v) > score(a, g.v) ? b : a))
    claimed.add(String(d._id)); match.set(g.line, d)
  })

  const add = []
  const update = []
  let unchanged = 0
  good.forEach((g) => {
    if (g.del || errors.some((e) => e.line === g.line)) return
    const d = match.get(g.line)
    if (!d) {
      const doc = { ...g.v, types: g.types }
      add.push({ line: g.line, ...doc })
      g.types.forEach((t) => {
        const lw = g.v.word.toLowerCase()
        if ((idx.get(key(t, lw)) || []).length) warnings.push({ line: g.line, word: g.v.word, msg: `${t} มีคำนี้อยู่แล้ว · จะเพิ่มเป็นอีกแถว (อีกความหมาย)` })
        else if (lw.length >= 4) {
          const near = docs.find((x) => (x.types || []).map(canonType).includes(t) && lev(lw, clean(x.word).toLowerCase()) <= (lw.length >= 8 ? 2 : 1))
          if (near) warnings.push({ line: g.line, word: g.v.word, msg: `${t} มีคำคล้ายกัน "${near.word}" · ถ้าตั้งใจแก้ตัวสะกด ให้ดาวน์โหลดไฟล์จากหน้านี้ (มี id) แล้วแก้ในไฟล์นั้น` })
        }
      })
      return
    }
    const after = {}
    // เทียบกับค่าดิบในระบบ: ต่างกันแค่ช่องว่างเกินก็นับเป็น "แก้" (ทำให้ข้อมูลสะอาด)
    FIELDS.forEach((k) => { if (String(d[k] ?? '') !== g.v[k]) after[k] = g.v[k] })
    const curTypes = (d.types || []).map(String)
    const addTypes = g.types.filter((t) => !curTypes.map(canonType).includes(t))
    if (addTypes.length) after.types = [...curTypes, ...addTypes]
    if (!Object.keys(after).length) { unchanged++; return }
    const before = {}
    Object.keys(after).forEach((k) => { before[k] = k === 'types' ? curTypes : d[k] ?? '' })
    update.push({ line: g.line, _id: String(d._id), word: d.word, before, after })
  })
  errors.sort((a, b) => a.line - b.line)
  warnings.sort((a, b) => a.line - b.line)
  return { rows: total, add, update, remove, unchanged, errors, warnings, tooMany: (rows || []).length > MAX_ROWS }
}
