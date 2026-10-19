// [v1.3] อ่านไฟล์ตารางในเบราว์เซอร์ (ไม่ต้องติดตั้ง library เพิ่ม): .xlsx (Excel) และ .csv / .txt
// คืนค่า: { header: [...], rows: [[...], ...] } (ชีตแรกของไฟล์ Excel)
// CSV: รองรับ UTF-8 (มี/ไม่มี BOM), UTF-16 (Excel "Unicode Text") และ Windows-874 (CSV ภาษาไทยแบบเก่าของ Excel)

// ---------- CSV ----------
function decodeText(buf) {
  const b = new Uint8Array(buf)
  if (b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder('utf-16le').decode(b.subarray(2))
  if (b[0] === 0xFE && b[1] === 0xFF) return new TextDecoder('utf-16be').decode(b.subarray(2))
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(b).replace(/^﻿/, '')
  } catch (e) {
    return new TextDecoder('windows-874').decode(b)
  }
}

export function parseCsv(text) {
  const first = (text.split(/\r?\n/, 1)[0] || '')
  const count = (ch) => first.split(ch).length - 1
  const delim = [',', ';', '\t'].reduce((a, c) => (count(c) > count(a) ? c : a), ',')
  const out = []
  let row = []
  let cell = ''
  let q = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (q) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++ } else q = false
      } else cell += ch
    } else if (ch === '"' && cell === '') q = true
    else if (ch === delim) { row.push(cell); cell = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cell); out.push(row); row = []; cell = ''
    } else cell += ch
  }
  if (cell !== '' || row.length) { row.push(cell); out.push(row) }
  return out
}

// ---------- XLSX (zip + xml) ----------
async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') throw new Error('เบราว์เซอร์นี้เปิดไฟล์ .xlsx ไม่ได้ ใช้ Chrome/Edge/Safari รุ่นใหม่ หรือบันทึกเป็น CSV UTF-8')
  const ds = new DecompressionStream('deflate-raw')
  const stream = new Blob([bytes]).stream().pipeThrough(ds)
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function unzip(buf, wanted) {
  const b = new Uint8Array(buf)
  const dv = new DataView(buf)
  let eocd = -1
  for (let i = b.length - 22; i >= Math.max(0, b.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break }
  if (eocd < 0) throw new Error('ไฟล์ Excel เสียหรือไม่ใช่ .xlsx')
  const n = dv.getUint16(eocd + 10, true)
  let p = dv.getUint32(eocd + 16, true)
  const files = {}
  const dec = new TextDecoder()
  for (let k = 0; k < n; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) break
    const method = dv.getUint16(p + 10, true)
    const csize = dv.getUint32(p + 20, true)
    const nlen = dv.getUint16(p + 28, true)
    const xlen = dv.getUint16(p + 30, true)
    const clen = dv.getUint16(p + 32, true)
    const off = dv.getUint32(p + 42, true)
    const name = dec.decode(b.subarray(p + 46, p + 46 + nlen))
    p += 46 + nlen + xlen + clen
    if (!wanted(name)) continue
    const lnl = dv.getUint16(off + 26, true)
    const lxl = dv.getUint16(off + 28, true)
    const data = b.subarray(off + 30 + lnl + lxl, off + 30 + lnl + lxl + csize)
    files[name] = method === 0 ? data : method === 8 ? await inflateRaw(data) : null
  }
  return files
}

const xml = (bytes) => new DOMParser().parseFromString(new TextDecoder().decode(bytes), 'application/xml')
const tags = (node, name) => Array.from(node.getElementsByTagNameNS('*', name))
const colIndex = (ref) => {
  const m = /^([A-Z]+)/.exec(ref || '')
  if (!m) return -1
  return m[1].split('').reduce((a, c) => a * 26 + c.charCodeAt(0) - 64, 0) - 1
}

export async function parseXlsx(buf) {
  const files = await unzip(buf, (n) => /^xl\/(workbook\.xml|_rels\/workbook\.xml\.rels|sharedStrings\.xml|worksheets\/[^/]+\.xml)$/.test(n))
  // ชีตแรกตามลำดับในไฟล์ (ไม่ใช่ชื่อไฟล์ sheet1 เสมอไป)
  let sheetPath = 'xl/worksheets/sheet1.xml'
  if (files['xl/workbook.xml'] && files['xl/_rels/workbook.xml.rels']) {
    const first = tags(xml(files['xl/workbook.xml']), 'sheet')[0]
    const rid = first && (first.getAttribute('r:id') || first.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id'))
    const rel = tags(xml(files['xl/_rels/workbook.xml.rels']), 'Relationship').find((r) => r.getAttribute('Id') === rid)
    if (rel) {
      const t = rel.getAttribute('Target').replace(/^\//, '')
      sheetPath = t.startsWith('xl/') ? t : 'xl/' + t
    }
  }
  if (!files[sheetPath]) throw new Error('ไม่พบชีตในไฟล์ Excel')
  const shared = files['xl/sharedStrings.xml']
    ? tags(xml(files['xl/sharedStrings.xml']), 'si').map((si) => tags(si, 't').map((t) => t.textContent).join(''))
    : []
  const out = []
  tags(xml(files[sheetPath]), 'row').forEach((r) => {
    const ri = parseInt(r.getAttribute('r'), 10) - 1
    const row = []
    tags(r, 'c').forEach((c, j) => {
      const ci = c.getAttribute('r') ? colIndex(c.getAttribute('r')) : j
      const t = c.getAttribute('t')
      const v = tags(c, 'v')[0]
      let val = ''
      if (t === 's') val = shared[parseInt(v && v.textContent, 10)] ?? ''
      else if (t === 'inlineStr') val = tags(c, 't').map((x) => x.textContent).join('')
      else val = v ? v.textContent : ''
      row[ci] = val
    })
    out[Number.isInteger(ri) && ri >= 0 ? ri : out.length] = Array.from(row, (x) => x ?? '')
  })
  return Array.from(out, (x) => x || [])
}

// ---------- รวม ----------
// ชื่อหัวคอลัมน์ที่รับได้ (อังกฤษ/ไทย ไม่สนตัวพิมพ์)
const HEAD = {
  id: ['id', 'รหัส'],
  word: ['word', 'words', 'คำ', 'คำศัพท์', 'ศัพท์'],
  pos: ['pos', 'part of speech', 'ชนิดคำ'],
  translation: ['translation', 'meaning', 'thai', 'คำแปล', 'ความหมาย', 'แปล'],
  synonym: ['synonym', 'synonyms', 'คำเหมือน', 'คำพ้อง'],
  types: ['types', 'type', 'course', 'คอร์ส', 'วิชา'],
  delete: ['delete', 'ลบ', 'ลบแถว', 'action'],
}

export async function readWordFile(file) {
  const buf = await file.arrayBuffer()
  const isZip = new Uint8Array(buf.slice(0, 2))[0] === 0x50 && new Uint8Array(buf.slice(0, 2))[1] === 0x4B
  if (/\.xls$/i.test(file.name) && !isZip) throw new Error('ไฟล์ .xls (Excel รุ่นเก่า) ใช้ไม่ได้ ให้กด Save As เป็น .xlsx หรือ CSV UTF-8')
  const table = isZip ? await parseXlsx(buf) : parseCsv(decodeText(buf))
  // หาแถวหัวตาราง (แถวแรกที่มีคำว่า word) ภายใน 10 แถวแรก
  const norm = (s) => String(s || '').trim().toLowerCase()
  let h = -1
  for (let i = 0; i < Math.min(10, table.length); i++) if ((table[i] || []).some((c) => HEAD.word.includes(norm(c)))) { h = i; break }
  if (h < 0) throw new Error('ไม่พบหัวตาราง ต้องมีคอลัมน์ word, pos, translation (synonym, types, id ใส่หรือไม่ก็ได้)')
  const col = {}
  table[h].forEach((c, i) => {
    const k = Object.keys(HEAD).find((key) => HEAD[key].includes(norm(c)))
    if (k && !(k in col)) col[k] = i
  })
  const miss = ['word', 'pos', 'translation'].filter((k) => !(k in col))
  if (miss.length) throw new Error(`ไม่พบคอลัมน์ ${miss.join(', ')} ในแถวหัวตาราง`)
  const rows = []
  for (let i = h + 1; i < table.length; i++) {
    const r = table[i] || []
    const o = { line: i + 1 }
    Object.keys(col).forEach((k) => { o[k] = r[col[k]] == null ? '' : String(r[col[k]]) })
    if (['word', 'pos', 'translation', 'synonym'].some((k) => String(o[k] || '').trim())) rows.push(o)
  }
  return { rows, hasTypes: 'types' in col, hasId: 'id' in col }
}
