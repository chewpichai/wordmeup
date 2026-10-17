// Admin → Practice: ดูความครบของเนื้อหา Let's Practice · ดาวน์โหลดรายการศัพท์ · อัปโหลดเนื้อหา
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { LP_VERSION } from 'libs/practice-version'

const TYPES = ['CUTEP', 'TOEIC', 'IELTS']
// เทาที่อ่านออก (คอนทราสต์ ≥ 4.5:1) · ไม่ใช้ .text-muted ของธีมหลัก (ธีมทำให้จางมาก)
const MUTED = { color: '#5E6170' }
const OK = { color: '#157A43', fontWeight: 600 } // เขียวที่อ่านออก (แทน .text-success ของธีม)

export default function AdminPractice() {
  const [type, setType] = useState('CUTEP')
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [mode, setMode] = useState('merge')
  // แก้คลังคำทีเดียวจากไฟล์ที่ตรวจแล้ว
  const [fixes, setFixes] = useState(null)
  const [fixPrev, setFixPrev] = useState(null)
  const [fixMsg, setFixMsg] = useState(null)
  const [fixBusy, setFixBusy] = useState(false)

  async function onFixFile(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setFixMsg(null)
    setFixPrev(null)
    setFixBusy(true)
    try {
      const json = JSON.parse(await file.text())
      const list = Array.isArray(json) ? json : json.fixes
      const r = await axios.post('/api/practice/admin/wordfix', { fixes: list, apply: false })
      setFixes(list)
      setFixPrev(r.data)
    } catch (err) {
      setFixMsg({ ok: false, text: err.response?.data?.message || (err instanceof SyntaxError ? 'ไฟล์ไม่ใช่ JSON ที่ถูกต้อง' : 'อ่านไฟล์ไม่สำเร็จ') })
    }
    setFixBusy(false)
  }
  async function applyFix() {
    setFixBusy(true)
    try {
      const r = await axios.post('/api/practice/admin/wordfix', { fixes, apply: true })
      setFixMsg({ ok: true, text: `แก้คลังคำแล้ว ${r.data.count} คำ` + (r.data.skipped.length ? ` · ข้าม ${r.data.skipped.length} รายการ` : '') + (r.data.reordered ? ' · ยังไม่มีนักเรียนเล่น ระบบเรียงชุดใหม่ a→z ตามตัวสะกดที่แก้แล้ว' : ''), canUndo: r.data.count > 0 })
      setFixPrev(null)
      setFixes(null)
      load()
    } catch (err) {
      setFixMsg({ ok: false, text: err.response?.data?.message || 'แก้ไม่สำเร็จ' })
    }
    setFixBusy(false)
  }
  async function undoFix() {
    if (!window.confirm('ย้อนกลับการแก้คลังคำครั้งล่าสุด?')) return
    setFixBusy(true)
    try {
      const r = await axios.post('/api/practice/admin/wordfix', { undo: true })
      setFixMsg({ ok: true, text: `ย้อนกลับแล้ว ${r.data.count} คำ` })
      load()
    } catch (err) {
      setFixMsg({ ok: false, text: err.response?.data?.message || 'ย้อนกลับไม่สำเร็จ' })
    }
    setFixBusy(false)
  }

  // สลับคอร์สเร็วๆ ไม่แสดงตารางผิดคอร์ส · โหลดไม่สำเร็จ = แจ้งเตือน (ไม่หมุนค้าง)
  const loadSeq = useRef(0)
  const [loadErr, setLoadErr] = useState('')
  function load(t = type) {
    const seq = ++loadSeq.current
    setData(null)
    setLoadErr('')
    axios.get(`/api/practice/admin/status?type=${t}`)
      .then((r) => { if (seq === loadSeq.current) setData(r.data) })
      .catch(() => { if (seq === loadSeq.current) setLoadErr('โหลดตารางไม่สำเร็จ ลองรีเฟรชหน้า') })
  }
  useEffect(() => { load(type) }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  const [dlErr, setDlErr] = useState('')
  async function download(path, name) {
    setDlErr('')
    try {
      const r = await axios.get(path, { responseType: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(r.data)
      a.download = name
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    } catch (err) {
      setDlErr('ดาวน์โหลดไม่สำเร็จ ลองใหม่อีกครั้ง (ถ้ายังไม่ได้ ให้รีเฟรชหน้า)')
    }
  }

  async function onFile(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setMsg(null)
    if (file.size > 8 * 1024 * 1024) return setMsg({ ok: false, text: 'ไฟล์ใหญ่เกิน 8 MB แบ่งเป็นไฟล์ละคอร์สแล้วอัปโหลดทีละไฟล์' })
    if (mode === 'replace' && !window.confirm('แทนที่ทั้งหมด: เนื้อหาในไฟล์นี้จะเป็นเนื้อหาทั้งหมดของคอร์สในไฟล์ ข้อที่ไม่อยู่ในไฟล์จะหายไป\nยืนยันอัปโหลด?')) return
    setBusy(true)
    try {
      const json = JSON.parse(await file.text())
      if (!json || typeof json !== 'object' || Array.isArray(json)) throw new SyntaxError('not object')
      const r = await axios.put('/api/practice/admin/content', { ...json, mode })
      setMsg({ ok: true, report: r.data.report })
      load()
    } catch (err) {
      const st = err.response?.status
      const d = err.response?.data
      const text = st === 413 ? 'ไฟล์ใหญ่เกิน 8 MB แบ่งเป็นไฟล์ละคอร์สแล้วอัปโหลดทีละไฟล์'
        : (d && typeof d === 'object' && d.message) || (err instanceof SyntaxError ? 'ไฟล์ไม่ใช่ JSON ที่ถูกต้อง' : 'อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง')
      setMsg({ ok: false, text, errors: d && typeof d === 'object' ? d.errors : null })
    }
    setBusy(false)
  }

  const full = data ? data.sets.filter((s) => s.complete).length : 0

  return (
    <main>
      <h1 className="h4 mb-1">Let&apos;s Practice · เนื้อหาแบบฝึก <small style={{ ...MUTED, fontSize: 13 }}>หน้าแอดมิน v{LP_VERSION}{data && data.version ? ` · server v${data.version}` : ''}</small></h1>
      <p className="mb-3" style={MUTED}>ระบบแบ่งคำของแต่ละคอร์สเป็นชุดละประมาณ 20 คำ เรียง a→z ตั้งแต่ครั้งแรกที่เปิดใช้ (ชุดสุดท้ายของรอบแรกอาจมีถึง 29 คำ) · คำที่เพิ่มทีหลังต่อท้ายเป็นชุดใหม่ (เปิดเมื่อครบ 10 คำ) ชุดเดิมไม่สลับ · แก้ตัวสะกดแล้วคำยังอยู่ชุดเดิม · นักเรียนเล่นได้ครบ 6 ด่านทุกชุดเสมอ · คำที่ยังไม่มีประโยค/คำเหมือน เกมจะใช้ข้อสำรองจากคำแปลให้อัตโนมัติ</p>

      <div className="d-flex flex-wrap align-items-center mb-3" style={{ gap: 8 }}>
        <select className="custom-select" style={{ width: 160, color: '#1F2340' }} aria-label="เลือกคอร์ส" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button className="btn btn-outline-primary" onClick={() => download(`/api/practice/admin/export?type=${type}`, `wordmeup-practice-${type}.csv`)}>
          <i className="bi bi-download mr-1" />ดาวน์โหลดรายการศัพท์ (Excel)
        </button>
        <button className="btn btn-outline-primary" onClick={() => download(`/api/practice/admin/content?type=${type}`, `practice-content-${type}.json`)}>
          <i className="bi bi-filetype-json mr-1" />ดาวน์โหลดเนื้อหาปัจจุบัน
        </button>
      </div>
      {dlErr && <div className="alert alert-danger">{dlErr}</div>}

      <div className="card mb-3"><div className="card-body">
        <h2 className="h6 mb-1">แก้คลังคำทีเดียว (ไฟล์ที่ทีม ENG ME UP ตรวจแล้ว)</h2>
        <p className="small mb-2" style={MUTED}>เลือกไฟล์ .json แล้วระบบจะแสดงรายการที่จะแก้ให้ดูก่อน · แก้เฉพาะคำที่ข้อมูลในระบบยังตรงกับที่ตรวจไว้ · เก็บค่าเดิมไว้ ย้อนกลับได้</p>
        <div className="d-flex flex-wrap align-items-center" style={{ gap: 8 }}>
          <label className={`btn btn-outline-primary mb-0 ${fixBusy ? 'disabled' : ''}`}>
            {fixBusy ? <span className="spinner-border spinner-border-sm mr-1" /> : <i className="bi bi-file-earmark-check mr-1" />}เลือกไฟล์แก้คลังคำ
            <input type="file" accept=".json,application/json" hidden disabled={fixBusy} onChange={onFixFile} />
          </label>
          <button className="btn btn-link btn-sm" type="button" disabled={fixBusy} onClick={undoFix}>ย้อนกลับการแก้ครั้งล่าสุด</button>
        </div>
        {fixPrev && (
          <div className="mt-3">
            <p className="mb-2"><b>จะแก้ {fixPrev.count} คำ</b>{fixPrev.already ? ` · แก้แล้วก่อนหน้านี้ ${fixPrev.already}` : ''}{fixPrev.skipped.length ? ` · ข้าม ${fixPrev.skipped.length}` : ''}</p>
            <div className="table-overflow" style={{ maxHeight: 360, overflow: 'auto' }}>
              <table className="table table-sm small mb-2">
                <thead className="thead-light"><tr><th>คอร์ส</th><th>คำ</th><th>เดิม</th><th>แก้เป็น</th><th>เหตุผล</th></tr></thead>
                <tbody>
                  {fixPrev.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.type}</td><td className="text-nowrap">{it.before.word}</td>
                      <td>{Object.keys(it.after).map((k) => <div key={k}><small style={MUTED}>{k}:</small> {String(it.before[k] ?? '')}</div>)}</td>
                      <td>{Object.keys(it.after).map((k) => <div key={k}><small style={MUTED}>{k}:</small> <b>{it.after[k]}</b></div>)}</td>
                      <td>{it.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {fixPrev.skipped.length > 0 && <ul className="small" style={MUTED}>{fixPrev.skipped.slice(0, 20).map((t, i) => <li key={i}>{t}</li>)}</ul>}
            <button className="btn btn-primary" type="button" disabled={fixBusy || !fixPrev.count} onClick={applyFix}>ยืนยันแก้ทั้งหมด {fixPrev.count} คำ</button>
            <button className="btn btn-link" type="button" onClick={() => { setFixPrev(null); setFixes(null) }}>ยกเลิก</button>
          </div>
        )}
        {fixMsg && <div className={`alert ${fixMsg.ok ? 'alert-success' : 'alert-danger'} mt-3 mb-0`}>{fixMsg.text}</div>}
      </div></div>

      <div className="card mb-3"><div className="card-body">
        <h2 className="h6 mb-1">อัปโหลดเนื้อหา (ไฟล์ .json)</h2>
        <p className="small mb-2" style={MUTED}>แนะนำ: กด &quot;ดาวน์โหลดเนื้อหาปัจจุบัน&quot; แล้วแก้จากไฟล์นั้น · ข้อแปลงร่างทุกข้อมี id (เช่น abduct#1) ใช้ id เดิม = แก้ข้อนั้น · ใส่ &quot;delete&quot;: true = ลบข้อนั้น · คำอธิบาย (tip) ใส่ได้แค่ &lt;b&gt; &lt;i&gt; &lt;br&gt;</p>
        <div className="d-flex flex-wrap align-items-center" style={{ gap: 12 }}>
          <div className="custom-control custom-radio">
            <input type="radio" id="m1" className="custom-control-input" checked={mode === 'merge'} onChange={() => setMode('merge')} />
            <label className="custom-control-label" htmlFor="m1">เพิ่ม/แก้ทับของเดิม (แนะนำ)</label>
          </div>
          <div className="custom-control custom-radio">
            <input type="radio" id="m2" className="custom-control-input" checked={mode === 'replace'} onChange={() => setMode('replace')} />
            <label className="custom-control-label" htmlFor="m2">แทนที่ทั้งหมดของคอร์สในไฟล์ (ข้อที่ไม่อยู่ในไฟล์จะหายไป)</label>
          </div>
          <label className={`btn btn-primary mb-0 ${busy ? 'disabled' : ''}`}>
            {busy ? <span className="spinner-border spinner-border-sm mr-1" /> : <i className="bi bi-upload mr-1" />}เลือกไฟล์แล้วอัปโหลด
            <input type="file" accept=".json,application/json" hidden disabled={busy} onChange={onFile} />
          </label>
        </div>
        {msg && msg.ok && (
          <div className="alert alert-success mt-3 mb-0">
            บันทึกแล้ว {msg.report.map((r) => `${r.type}: ${r.words} คำ, ${r.form} ข้อแปลงร่าง${r.deleted ? `, ลบ ${r.deleted} รายการ` : ''} (ตอนนี้มีข้อแปลงร่างทั้งหมด ${r.totalForm} ข้อ)`).join(' · ')}
            {msg.report.some((r) => r.warningCount) && (
              <ul className="mb-0 mt-2 small">{msg.report.flatMap((r) => r.warnings).map((w, i) => <li key={i}>{w}</li>)}</ul>
            )}
          </div>
        )}
        {msg && !msg.ok && (
          <div className="alert alert-danger mt-3 mb-0">
            {msg.text}
            {msg.errors && <ul className="mb-0 mt-2 small">{msg.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
          </div>
        )}
      </div></div>

      {loadErr && <div className="alert alert-danger">{loadErr}</div>}
      {!data ? (!loadErr && <div className="text-center"><div className="spinner-border" /></div>) : (
        <>
          <p className="mb-2"><b>{data.label}</b> · {data.total} ชุด · เนื้อหาแต่งครบทุกคำแล้ว <b>{full}</b> ชุด{data.waiting ? ` · คำใหม่ ${data.waiting} คำ รอรวมเป็นชุดใหม่ (เปิดให้เล่นเมื่อครบ 10 คำ)` : ''}</p>
          <div className="table-overflow">
            <table className="table table-sm text-center">
              <thead className="thead-light">
                <tr><th>ชุด</th><th className="text-left">คำ</th><th>ประโยค</th><th>คำเหมือน</th><th>ชนิดคำ</th><th>ข้อแปลงร่าง</th><th className="text-left">สถานะ</th></tr>
              </thead>
              <tbody>
                {data.sets.map((s) => (
                  <tr key={s.no}>
                    <th>{s.no}</th>
                    <td className="text-left text-nowrap">{s.count ? `${s.first} → ${s.last}` : 'ไม่มีคำ'} <small style={MUTED}>({s.count})</small></td>
                    <td>{s.sentences}/{s.count}</td>
                    <td>{s.synonyms}/{s.count}</td>
                    <td>{s.pos}/{s.count}</td>
                    <td>{s.form}</td>
                    <td className="text-left">{s.complete
                      ? <span style={OK}><i className="bi bi-check-circle-fill mr-1" aria-hidden="true" />ครบ</span>
                      : <small style={MUTED} title={s.missing.join(', ')}>ใช้ข้อสำรอง: {s.missing.slice(0, 4).join(', ')}{s.missing.length > 4 ? ` +${s.missing.length - 4}` : ''}{s.form < 5 ? ' · แปลงร่างยืมจากชุดข้างเคียง' : ''}</small>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}
