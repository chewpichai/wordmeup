// Let's Practice: แบ่งคำศัพท์เป็นชุด + รวมเนื้อหาจาก data/practice-content.json
import { Word, PracticeContent, PracticeOrder } from 'models'
import CONTENT from 'data/practice-content.json'

export const SET_SIZE = 20
export const STAGE_IDS = ['s1', 's2', 's3', 's4', 's5', 'boss']
export const COURSES = ['CUTEP', 'TOEIC', 'IELTS']
const STAGE_Q = 10 // จำนวนข้อต่อด่าน
const MIN_LAST = 10 // ตอนแบ่งชุดครั้งแรก: เศษท้ายที่ไม่ถึง 10 คำรวมกับชุดก่อนหน้า (ชุดจึงมี "ประมาณ" 20 คำ: 20-29 คำ)
export const MIN_NEW = 10 // คำที่เพิ่มทีหลัง: ชุดใหม่ท้ายสุดจะเปิดให้เล่นเมื่อมีคำใหม่ครบ 10 คำ (ระหว่างนั้นแอดมินเห็นจำนวนที่รออยู่)

// เทียบคำแบบไม่สนตัวพิมพ์/ช่องว่างรอบขีด เช่น "Long - term" = "long-term"
export const normWord = (w) => String(w || '').toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim()

export const typeKey = (t) => String(t || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
// ชื่อคอร์สแบบมาตรฐาน: cutep / CU-TEP / Cutep → CUTEP (คอร์สที่ไม่รู้จัก คืนค่าแบบตัวพิมพ์ใหญ่ไม่มีขีด)
export const canonType = (t) => COURSES.find((c) => c === typeKey(t)) || typeKey(t)

// ---------- คำอธิบาย (tip) ใส่ตัวหนาได้ แต่ห้ามมีโค้ด: เหลือแค่ <b> <i> <br> <span> แบบไม่มี attribute ----------
const TIP_TAGS = { b: 1, i: 1, br: 1, span: 1 }
const escText = (t) => t.replace(/&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export function cleanTip(html) {
  const s = String(html == null ? '' : html)
  const re = /<\s*(\/?)\s*([a-zA-Z0-9]*)[^>]*>/g
  let out = ''
  let last = 0
  let m
  while ((m = re.exec(s))) {
    out += escText(s.slice(last, m.index))
    const tag = m[2].toLowerCase()
    if (TIP_TAGS[tag]) out += tag === 'br' ? '<br>' : `<${m[1]}${tag}>`
    last = re.lastIndex
  }
  return out + escText(s.slice(last))
}

// ---------- ตรวจข้อแปลงร่าง 1 ข้อ: คืนข้อความปัญหา (ว่าง = ใช้ได้) ----------
export function answerIndex(a) {
  if (typeof a === 'string' && /^\s*\d+\s*$/.test(a)) a = Number(a)
  return Number.isInteger(a) && a >= 0 && a <= 3 ? a : -1
}
export function formProblem(f) {
  if (!f || typeof f !== 'object') return 'ข้อมูลไม่ถูกต้อง'
  if (typeof f.w !== 'string' || !f.w.trim() || typeof f.s !== 'string' || !f.s.trim() || !Array.isArray(f.o)) return 'ต้องมี w, s, o'
  if (f.o.length !== 4) return 'ต้องมีตัวเลือก 4 ตัว'
  const o = f.o.map((x) => (x == null ? '' : String(x).trim()))
  if (o.some((x) => !x)) return 'ตัวเลือกห้ามว่าง'
  if (new Set(o.map((x) => x.toLowerCase())).size !== 4) return 'ตัวเลือกห้ามซ้ำกัน'
  if (answerIndex(f.a) < 0) return 'a ต้องเป็นเลขจำนวนเต็ม 0-3'
  if ((f.s.match(/___/g) || []).length !== 1) return 'ประโยคต้องมีช่องว่าง ___ 1 ช่องพอดี'
  return ''
}

// ---------- เนื้อหา = ไฟล์ data/practice-content.json (ค่าตั้งต้น) + ที่แอดมินอัปโหลด (ฐานข้อมูล) ----------
export function fileContent(type) {
  const k = typeKey(type)
  const hit = Object.keys(CONTENT).find((c) => c[0] !== '_' && typeKey(c) === k)
  return (hit && CONTENT[hit]) || { words: {}, form: [] }
}
export const formWs = (f) => `${normWord(f.w)}|${String(f.s || '').trim()}`
// ทุกข้อแปลงร่างมี id คงที่ (เช่น "abduct#1") → อัปโหลดข้อที่ id ตรงกัน = แก้ข้อนั้น · ใส่ "delete": true = ลบข้อนั้น
const withIds = (form) => {
  const n = {}
  return (form || []).filter(Boolean).map((f) => {
    const w = normWord(f.w)
    n[w] = (n[w] || 0) + 1
    return f.id ? f : { ...f, id: `${w}#${n[w]}` }
  })
}
// avoid เก็บในฐานข้อมูลเป็น "hinder|impede" (บางเวอร์ชันของ MongoDB/FerretDB ไม่รับ array ซ้อน array)
export const decAvoid = (a) => (Array.isArray(a) ? a : [])
  .map((g) => (Array.isArray(g) ? g.map(String) : String(g || '').split('|')).map((w) => w.trim()).filter(Boolean))
  .filter((g) => g.length > 1)
export const encAvoid = (a) => decAvoid(a).map((g) => g.join('|'))

export function mergeContent(base, db) {
  const baseForm = withIds(base.form)
  if (!db) return { label: base.label, words: { ...(base.words || {}) }, form: baseForm, avoid: decAvoid(base.avoid) }
  if (db.mode === 'replace') {
    const words = {}
    Object.entries(db.words || {}).forEach(([k, v]) => { if (v && typeof v === 'object' && !v.delete) words[k] = v })
    return { label: db.label || base.label, words, form: withIds((db.form || []).filter((f) => f && !f.delete)), avoid: decAvoid(db.avoid) }
  }
  // merge: คำ = ทับทีละช่อง (s / syn) · ข้อแปลงร่าง = ทับตาม id · "delete": true = ลบออก
  const words = {}
  const keyOf = {}
  Object.entries(base.words || {}).forEach(([k, v]) => { words[k] = { ...v }; keyOf[normWord(k)] = k })
  Object.entries(db.words || {}).forEach(([k, v]) => {
    if (!v || typeof v !== 'object') return
    const nk = normWord(k)
    const old = keyOf[nk]
    const cur = old ? words[old] : {}
    if (old) delete words[old]
    delete keyOf[nk]
    if (v.delete) return
    const { delete: _d, ...rest } = v
    words[k] = { ...cur, ...rest }
    keyOf[nk] = k
  })
  const byWs = new Map(baseForm.map((f) => [formWs(f), f.id]))
  const map = new Map(baseForm.map((f) => [f.id, f]))
  ;(db.form || []).forEach((f) => {
    if (!f || typeof f !== 'object') return
    const id = f.id || byWs.get(formWs(f)) || `ws:${formWs(f)}`
    if (f.delete) map.delete(id)
    else map.set(id, { ...f, id })
  })
  const avoid = db.avoid != null ? decAvoid(db.avoid) : decAvoid(base.avoid)
  return { label: db.label || base.label, words, form: [...map.values()], avoid }
}
export async function loadContent(type) {
  const db = await PracticeContent.findOne({ type: typeKey(type) }).lean()
  return mergeContent(fileContent(type), db)
}

// pos ในฐานข้อมูลเขียนได้หลายแบบ (n. / noun / Adj / v.t.) → n | v | adj | adv · ถ้ามีหลายชนิด ("n./v.") คืน '' (ไม่เอาไปใช้ในด่านแยกกลุ่ม)
export function normPos(pos) {
  const parts = String(pos || '').toLowerCase().split(/[\/,;|&]| or /).map((p) => p.replace(/[^a-z]/g, '')).filter(Boolean)
  const map = (p) => (/^(n|noun)$/.test(p) ? 'n' : /^(v|vt|vi|verb)$/.test(p) ? 'v' : /^(adj|a|adjective)$/.test(p) ? 'adj' : /^(adv|adverb|ad)$/.test(p) ? 'adv' : '')
  const kinds = [...new Set(parts.map(map))]
  return kinds.length === 1 ? kinds[0] : ''
}

// ---------- ลำดับคำแบบคงที่ (ชุดไม่สลับเมื่อเพิ่ม/ลบ/แก้ตัวสะกดคำ) ----------
// ครั้งแรก: เรียงคำทั้งคอร์ส a→z แล้วบันทึกลำดับ (_id ของคำ) ไว้ใน collection practiceorders
// หลังจากนั้น: คำที่เพิ่มใหม่ต่อท้ายเสมอ · คำที่แก้ตัวสะกดอยู่ตำแหน่งเดิม (_id เดิม) · คำที่ถูกลบ = ช่องว่าง (ชุดนั้นเหลือคำน้อยลง ชุดอื่นไม่ขยับ)
async function stableOrder(tk, entries) {
  let doc = await PracticeOrder.findOne({ type: tk }).lean()
  if (!doc || !Array.isArray(doc.ids)) {
    const ids = [...entries]
      .sort((a, b) => normWord(a.word).localeCompare(normWord(b.word)) || (a.ids[0] < b.ids[0] ? -1 : 1))
      .map((e) => e.ids[0])
    if (!doc) {
      await PracticeOrder.createIndexes().catch(() => {}) // unique { type: 1 } (มีอยู่แล้ว = ไม่ทำอะไร)
      try {
        await PracticeOrder.create({ type: tk, ids, base: ids.length })
      } catch (e) {
        if (e.code !== 11000) throw e // มีคำขออื่นสร้างไปพร้อมกันแล้ว ใช้ของที่มีอยู่
      }
    } else {
      await PracticeOrder.updateOne({ type: tk, ids: { $exists: false } }, { $set: { ids, base: ids.length } })
    }
    doc = await PracticeOrder.findOne({ type: tk }).lean()
  }
  const index = (d) => {
    const pos = new Map()
    ;(d.ids || []).forEach((id, i) => { if (!pos.has(id)) pos.set(id, i) })
    return pos
  }
  let pos = index(doc)
  const fresh = entries.filter((e) => !e.ids.some((id) => pos.has(id))).map((e) => e.ids[0]).sort()
  if (fresh.length) {
    await PracticeOrder.updateOne({ type: tk }, { $addToSet: { ids: { $each: fresh } } })
    doc = await PracticeOrder.findOne({ type: tk }).lean()
    pos = index(doc)
  }
  return { pos, base: doc.base || 0, len: (doc.ids || []).length }
}

// จุดเริ่มของแต่ละชุด (นับเป็นตำแหน่ง)
// - ช่วงที่ตัดไว้ตอนแรก [0, base): ทีละ 20 · เศษท้ายที่ไม่ถึง 10 รวมกับชุดก่อนหน้า · base ไม่เปลี่ยนอีก ชุดเหล่านี้จึงคงที่
// - คำที่เพิ่มทีหลัง [base, len): ช่องละ 20 ตำแหน่งตายตัว (ไม่รวมเศษ ไม่ตัดใหม่) → คำที่อยู่ในชุดแล้วไม่ย้ายชุดอีก
export function cutStarts(base, len) {
  const starts = []
  const b = Math.min(base, len)
  for (let s = 0; s < b; s += SET_SIZE) starts.push(s)
  if (starts.length > 1 && b - starts[starts.length - 1] < MIN_LAST) starts.pop()
  const firstNew = starts.length
  for (let s = b; s < len; s += SET_SIZE) starts.push(s)
  return { starts, firstNew }
}

// คำทั้งหมดของ courseType ตัดคำซ้ำ แล้วแบ่งเป็นชุดตามลำดับคงที่ (ชุดละประมาณ 20 คำ)
export async function getSets(type) {
  const docs = await Word.find({ types: type }).select('word pos translation synonym').lean()
  docs.sort((a, b) => (String(a._id) < String(b._id) ? -1 : 1))
  // คำซ้ำ (สะกดเหมือนกันหลายแถว เช่น deposit = ทับถม / เงินฝาก) → รวมเป็นคำเดียว ความหมายรวมกัน
  const map = new Map()
  docs.forEach((d) => {
    if (!d.word || !String(d.word).trim()) return
    const k = normWord(d.word)
    const cur = map.get(k)
    if (!cur) return map.set(k, { ...d, ids: [String(d._id)] })
    cur.ids.push(String(d._id))
    const join = (a, b) => (!b || String(a || '').includes(String(b).trim()) ? a : [a, b].filter(Boolean).join(' / '))
    cur.translation = join(cur.translation, d.translation)
    cur.synonym = join(cur.synonym, d.synonym)
    if (normPos(cur.pos) !== normPos(d.pos)) cur.pos = [cur.pos, d.pos].join(',')
  })
  const entries = [...map.values()]
  if (!entries.length) return []
  const order = await stableOrder(typeKey(type), entries)
  entries.forEach((e) => {
    e.at = Math.min(...e.ids.map((id) => (order.pos.has(id) ? order.pos.get(id) : Infinity)))
  })
  entries.sort((a, b) => a.at - b.at)
  const { starts, firstNew } = cutStarts(order.base, order.len)
  const sets = starts.map(() => [])
  let j = 0
  entries.forEach((e) => {
    while (j + 1 < starts.length && e.at >= starts[j + 1]) j++
    sets[j].push(e)
  })
  // ชุดของคำใหม่ท้ายสุดที่ยังมีไม่ถึง 10 คำ: ยังไม่เปิด (นับไว้ใน waiting ให้แอดมินเห็น) · ชุดว่างท้ายสุดไม่แสดง
  // ชุดกลางๆ ที่คำถูกลบจนว่าง ยังนับเลขชุดไว้ (เลขชุดอื่นไม่เลื่อน) และไม่บล็อกชุดถัดไป
  let waiting = 0
  while (sets.length && (!sets[sets.length - 1].length || (sets.length > firstNew && sets[sets.length - 1].length < MIN_NEW))) {
    waiting += sets.pop().length
  }
  sets.waiting = waiting
  return sets
}

// แปลงคำ 1 ชุดเป็นข้อมูลที่เกมใช้
// ทุกด่านเล่นได้เสมอ ไม่มี "เร็วๆ นี้":
//  - ด่านแปลงร่าง: ถ้าข้อของคำในชุดนี้มีไม่ถึง 10 ข้อ ยืมข้อของคำที่อยู่ใกล้กัน (ตามตัวอักษร) ในคอร์สเดียวกันมาเติมให้ครบ
//  - ด่านอื่น: ถ้าคำไหนยังไม่มีประโยค/คำเหมือน เกมจะใช้ข้อสำรองจากคำแปลไทยของคำนั้นแทน (ดู build() ใน letspractice.js)
export function buildSet(type, no, chunk, total, C) {
  const cw = {}
  Object.entries(C.words || {}).forEach(([k, v]) => { cw[normWord(k)] = v || {} })
  const words = chunk.map((d) => {
    const w = String(d.word).trim()
    const extra = cw[normWord(w)] || {}
    const s = typeof extra.s === 'string' && (extra.s.match(/___/g) || []).length === 1 ? extra.s : ''
    return { w, p: normPos(d.pos), th: String(d.translation || '').trim(), syn: String(extra.syn || d.synonym || '').trim(), s }
  })
  const byNorm = new Map(words.map((x) => [normWord(x.w), x.w]))
  const valid = (C.form || []).filter((f) => !formProblem(f))
    .map((f) => ({ id: f.id, w: f.w, s: f.s, o: f.o.map((x) => String(x).trim()), a: answerIndex(f.a), tip: cleanTip(f.tip) }))
  const own = valid.filter((f) => byNorm.has(normWord(f.w))).map((f) => ({ ...f, w: byNorm.get(normWord(f.w)) }))
  let form = own
  if (own.length < STAGE_Q && valid.length) {
    const pool = valid.filter((f) => !byNorm.has(normWord(f.w))).sort((a, b) => normWord(a.w).localeCompare(normWord(b.w)))
    const first = normWord(words[0]?.w)
    let hi = pool.findIndex((f) => normWord(f.w).localeCompare(first) >= 0)
    if (hi < 0) hi = pool.length
    let lo = hi - 1
    const extra = []
    while (own.length + extra.length < STAGE_Q && (lo >= 0 || hi < pool.length)) {
      if (hi < pool.length) extra.push({ ...pool[hi++], borrowed: true })
      if (own.length + extra.length < STAGE_Q && lo >= 0) extra.push({ ...pool[lo--], borrowed: true })
    }
    form = own.concat(extra)
  }
  // กลุ่มคำความหมายใกล้กันมาก (เฉพาะที่อยู่ในชุดนี้) → เกมจะไม่ใช้เป็นตัวหลอกของกันและกัน
  const avoid = decAvoid(C.avoid)
    .map((g) => g.map((w) => byNorm.get(normWord(w))).filter(Boolean))
    .filter((g) => g.length > 1)
  const authored = { sentences: words.filter((x) => x.s).length, synonyms: words.filter((x) => x.syn).length, pos: words.filter((x) => x.p).length, form: own.length }
  return { no, total, label: C.label || labelOf(type), words, form, avoid, authored, avail: availability(words) }
}

// ทุกด่านเปิดได้เสมอเมื่อชุดมีคำตั้งแต่ 4 คำ
export function availability(words) {
  const ok = words.length >= 4
  return { s1: words.length >= 2, s2: ok, s3: ok, s4: ok, s5: ok, boss: ok }
}

export const setKey = (type, no) => `${typeKey(type) || 'X'}_${no}`

export function setProgress(prog, type, no) {
  const p = (prog && prog.sets && prog.sets[setKey(type, no)]) || {}
  return { stars: p.stars || {}, got: p.got || [] }
}

// ชุดที่ 1 เปิดเสมอ · ชุดถัดไปเปิดเมื่อผ่านบอสของชุดก่อนหน้า (เปิดตามลำดับเท่านั้น · แอดมินเปิดได้ทุกชุด)
// ชุดที่มีคำไม่ถึง 4 คำ (ไม่มีด่านบอส) จะไม่บล็อกชุดถัดไป
export function isUnlocked(prog, type, no, isAdmin, chunks) {
  if (isAdmin || no <= 1) return true
  for (let k = no - 1; k >= 1; k--) {
    if ((setProgress(prog, type, k).stars.boss || 0) > 0) return true
    if (!(chunks && chunks[k - 1] && chunks[k - 1].length < 4)) return false
  }
  return true
}
// ชุดที่มีคำไม่ถึง 4 คำ ไม่มีด่านบอส → นับว่าผ่านแล้ว (ไม่ค้างเป็น "ชุดปัจจุบัน")
export const isPassed = (prog, type, no, chunk) => (setProgress(prog, type, no).stars.boss || 0) > 0 || !chunk || chunk.length < 4

// ผู้เรียนเห็นเฉพาะ courseType ของตัวเอง · แอดมินส่ง ?type= มาดูชุดอื่นได้ (ไม่สนตัวพิมพ์ใหญ่เล็ก: cutep = CUTEP)
export function resolveType(req) {
  const me = req.me
  const t = me.isAdmin && req.query.type ? String(req.query.type) : String(me.courseType || '')
  const c = canonType(t)
  return COURSES.includes(c) ? c : t
}

const LABELS = { CUTEP: 'CU-TEP', TOEIC: 'TOEIC', IELTS: 'IELTS' }
export const labelOf = (type) => LABELS[typeKey(type)] || String(type || '')
