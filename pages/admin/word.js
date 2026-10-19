import axios from 'axios'
import { useEffect, useState } from 'react'
import { WordForm } from 'components'
import { LP_VERSION } from 'libs/practice-version'
import { readWordFile } from 'libs/sheet-read'

// [v1.3] สีที่อ่านออก (คอนทราสต์ ≥ 4.5:1) ไม่ใช้ .text-muted ของธีม
const MUTED = { color: '#5E6170' }
const SCROLL = { maxHeight: 320, overflow: 'auto' }
const BTN = { maxWidth: '100%', whiteSpace: 'normal' } // ปุ่มไม่ล้นจอมือถือ

const INIT_WORD = {
  word: '',
  pos: '',
  translation: '',
  synonym: '',
  types: [],
}

export default function Word() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingWord, setEditingWord] = useState(INIT_WORD)
  const [wordType, setWordType] = useState('CUTEP')
  // [v1.3] นำเข้า/ส่งออกคลังคำทีเดียวจากไฟล์ Excel/CSV
  const [imp, setImp] = useState(null) // ผลตรวจไฟล์ (ยังไม่แก้อะไร)
  const [impReq, setImpReq] = useState(null) // ข้อมูลที่จะส่งตอนยืนยัน
  const [impBusy, setImpBusy] = useState(false)
  const [impMsg, setImpMsg] = useState(null)
  const [askUndo, setAskUndo] = useState(false)

  function loadWords() {
    return axios.get('/api/word')
      .then(response => {
        setWords(response.data)
        setLoading(false)
      })
  }
  useEffect(() => { loadWords() }, [])

  async function exportWords() {
    setImpMsg(null)
    try {
      const r = await axios.get(`/api/word/export?type=${wordType}`, { responseType: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(r.data)
      a.download = `wordmeup-words-${wordType}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    } catch (err) {
      setImpMsg({ ok: false, text: 'ดาวน์โหลดไม่สำเร็จ ลองใหม่อีกครั้ง (ถ้ายังไม่ได้ ให้รีเฟรชหน้า)' })
    }
  }

  async function onImportFile(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setImp(null); setImpReq(null); setImpMsg(null); setAskUndo(false)
    if (file.size > 6 * 1024 * 1024) return setImpMsg({ ok: false, text: 'ไฟล์ใหญ่เกิน 6 MB แบ่งเป็นไฟล์ละคอร์สแล้วนำเข้าทีละไฟล์' })
    setImpBusy(true)
    try {
      const { rows, hasTypes } = await readWordFile(file)
      if (!rows.length) throw new Error('ไม่พบแถวคำศัพท์ใต้หัวตาราง')
      const req = { rows, type: wordType, file: file.name }
      const r = await axios.post('/api/word/import', { ...req, apply: false })
      setImpReq(req)
      setImp({ ...r.data, file: file.name, hasTypes, type: wordType })
    } catch (err) {
      const d = err.response?.data
      setImpMsg({ ok: false, text: (d && d.message) || err.message || 'อ่านไฟล์ไม่สำเร็จ', errors: d && d.errors })
    }
    setImpBusy(false)
  }

  async function applyImport() {
    setImpBusy(true)
    try {
      const r = await axios.post('/api/word/import', { ...impReq, apply: true })
      const d = r.data
      setImpMsg({ ok: true, text: `นำเข้าแล้ว · เพิ่มคำใหม่ ${d.added} คำ · แก้ ${d.updated} คำ` + (d.removed ? ` · ลบคำซ้ำ ${d.removed} คำ` : '') + ` · เหมือนเดิม ${d.unchanged} คำ` + (d.errors ? ` · ข้ามแถวที่มีปัญหา ${d.errors} แถว` : '') })
      setImp(null); setImpReq(null)
      await loadWords()
    } catch (err) {
      setImpMsg({ ok: false, text: err.response?.data?.message || 'นำเข้าไม่สำเร็จ ยังไม่ได้แก้อะไร ลองใหม่อีกครั้ง' })
    }
    setImpBusy(false)
  }

  async function undoImport() {
    setAskUndo(false)
    setImpBusy(true)
    try {
      const r = await axios.post('/api/word/import', { undo: true })
      const d = r.data
      setImpMsg({ ok: true, text: `ย้อนกลับแล้ว · คืนค่าเดิม ${d.reverted} คำ · ลบคำที่เพิ่ม ${d.removed} คำ` + (d.restored ? ` · ใส่คำซ้ำที่ลบไปคืน ${d.restored} คำ` : '') + (d.kept ? ` · เก็บไว้ ${d.kept} คำ (นักเรียนมีในรายการท่องแล้ว)` : '') })
      await loadWords()
    } catch (err) {
      setImpMsg({ ok: false, text: err.response?.data?.message || 'ย้อนกลับไม่สำเร็จ' })
    }
    setImpBusy(false)
  }

  function handleAddClick() {
    setEditingWord(INIT_WORD)
    $('#modal-form').modal('show')
  }

  function handleEditClick(word) {
    return () => {
      setEditingWord(word)
      $('#modal-form').modal('show')
    }
  }

  function handleDeleteClick(word) {
    return () => {
      axios.delete(`/api/word/${word._id}`)
        .then(() => {
          setWords(prev => {
            const i = prev.findIndex(w => w._id === word._id)
            if (i !== -1)
              prev.splice(i, 1)
            return [...prev]
          })
        })
    }
  }

  function handleSave(word) {
    setWords(prev => {
      const i = prev.findIndex(w => w._id === word._id)
      if (i === -1)
        prev.push(word)
      else
        prev.splice(i, 1, word)
      return [...prev]
    })
    $('#modal-form').modal('hide')
  }

  if (loading)
    return <div className="text-center"><div className="spinner-border"/></div>

  const shown = words.filter((w) => w.types.includes(wordType))
  const F = ['word', 'pos', 'translation', 'synonym', 'types']

  return (
    <>
    <div className="card mb-3"><div className="card-body">
      <h2 className="h6 mb-1">แก้ / เพิ่มคำทีเดียวจากไฟล์ Excel <small style={{ ...MUTED, fontSize: 12 }}>หน้าแอดมิน v{LP_VERSION}</small></h2>
      <p className="small mb-2" style={MUTED}>
        ดาวน์โหลดคลังคำของคอร์สที่เลือก → แก้หรือเพิ่มแถวใน Excel → เลือกไฟล์กลับมา (.xlsx หรือ .csv) · ระบบแสดงก่อนว่าจะเพิ่ม/แก้/ลบอะไร แล้วค่อยกดยืนยัน · ย้อนกลับได้
        <br/>คอลัมน์: <b>word, pos, translation</b> (ต้องมี) · synonym · types (ไม่มี = ใช้คอร์สที่เลือกอยู่) · id (มีในไฟล์ที่ดาวน์โหลด อย่าลบ ถ้าจะแก้ตัวสะกด) · delete (ใส่ &quot;ลบ&quot; = ลบแถวนั้น ใช้ได้เฉพาะคำซ้ำ)
      </p>
      <div className="d-flex flex-wrap align-items-center" style={{ gap: 8 }}>
        <button className="btn btn-outline-primary" style={BTN} type="button" onClick={exportWords} disabled={impBusy}>
          <i className="bi bi-download mr-1" />ดาวน์โหลดคลังคำ {wordType} (Excel)
        </button>
        <label className={`btn btn-primary mb-0 ${impBusy ? 'disabled' : ''}`} style={BTN}>
          {impBusy ? <span className="spinner-border spinner-border-sm mr-1" /> : <i className="bi bi-upload mr-1" />}เลือกไฟล์คำศัพท์ (.xlsx / .csv)
          <input type="file" accept=".xlsx,.csv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" hidden disabled={impBusy} onChange={onImportFile} />
        </label>
        {!askUndo
          ? <button className="btn btn-link btn-sm" type="button" disabled={impBusy} onClick={() => setAskUndo(true)}>ย้อนกลับการนำเข้าครั้งล่าสุด</button>
          : <span className="small">ย้อนกลับการนำเข้าครั้งล่าสุด? <button className="btn btn-sm btn-danger ml-1" type="button" onClick={undoImport}>ย้อนกลับ</button> <button className="btn btn-sm btn-link" type="button" onClick={() => setAskUndo(false)}>ไม่</button></span>}
      </div>

      {imp && (
        <div className="mt-3">
          <p className="mb-1"><b>ไฟล์ {imp.file}</b> · {imp.rows} แถว{!imp.hasTypes ? ` · ไม่มีคอลัมน์ types จึงใช้คอร์ส ${imp.type}` : ''}</p>
          <p className="mb-2">
            <b>เพิ่มคำใหม่ {imp.add.length}</b> · <b>แก้ {imp.update.length} คำ</b>{imp.remove.length ? <> · <b>ลบคำซ้ำ {imp.remove.length}</b></> : ''} · เหมือนเดิม {imp.unchanged} คำ
            {imp.errors.length ? <> · <span style={{ color: '#B42318', fontWeight: 600 }}>มีปัญหา {imp.errors.length} แถว (จะข้าม)</span></> : ''}
            {imp.warnings.length ? ` · ข้อควรดู ${imp.warnings.length}` : ''}
          </p>
          {imp.errors.length > 0 && (
            <details open className="mb-2"><summary>แถวที่มีปัญหา (แก้ในไฟล์แล้วเลือกไฟล์ใหม่ได้)</summary>
              <ul className="small mb-0" style={SCROLL}>{imp.errors.map((x, i) => <li key={i}>แถว {x.line} · {x.word}: {x.msg}</li>)}</ul>
            </details>
          )}
          {imp.warnings.length > 0 && (
            <details open className="mb-2"><summary>ข้อควรดู</summary>
              <ul className="small mb-0" style={SCROLL}>{imp.warnings.map((x, i) => <li key={i}>แถว {x.line} · {x.word}: {x.msg}</li>)}</ul>
            </details>
          )}
          {imp.update.length > 0 && (
            <details className="mb-2"><summary>คำที่จะแก้ ({imp.update.length})</summary>
              <div className="table-overflow" style={SCROLL}>
                <table className="table table-sm small mb-0">
                  <thead className="thead-light"><tr><th>แถว</th><th>คำ</th><th>เดิม</th><th>แก้เป็น</th></tr></thead>
                  <tbody>{imp.update.map((u, i) => (
                    <tr key={i}>
                      <td>{u.line}</td><td className="text-nowrap">{u.word}</td>
                      <td>{Object.keys(u.after).map((k) => <div key={k}><small style={MUTED}>{k}:</small> {k === 'types' ? u.before[k].join(', ') : String(u.before[k] ?? '')}</div>)}</td>
                      <td>{Object.keys(u.after).map((k) => <div key={k}><small style={MUTED}>{k}:</small> <b>{k === 'types' ? u.after[k].join(', ') : u.after[k]}</b></div>)}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </details>
          )}
          {imp.remove.length > 0 && (
            <details open className="mb-2"><summary>คำซ้ำที่จะลบ ({imp.remove.length}) · อีกแถวของคำเดียวกันยังอยู่</summary>
              <div className="table-overflow" style={SCROLL}>
                <table className="table table-sm small mb-0">
                  <thead className="thead-light"><tr><th>แถว</th><th>word</th><th>pos</th><th>translation</th><th>synonym</th></tr></thead>
                  <tbody>{imp.remove.map((x, i) => (
                    <tr key={i}><td>{x.line}</td><td>{x.word}</td><td>{x.pos}</td><td>{x.translation}</td><td>{x.synonym}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </details>
          )}
          {imp.add.length > 0 && (
            <details className="mb-2"><summary>คำใหม่ที่จะเพิ่ม ({imp.add.length})</summary>
              <div className="table-overflow" style={SCROLL}>
                <table className="table table-sm small mb-0">
                  <thead className="thead-light"><tr><th>แถว</th>{F.map((k) => <th key={k}>{k}</th>)}</tr></thead>
                  <tbody>{imp.add.map((a, i) => (
                    <tr key={i}><td>{a.line}</td>{F.map((k) => <td key={k}>{k === 'types' ? a.types.join(', ') : a[k]}</td>)}</tr>
                  ))}</tbody>
                </table>
              </div>
            </details>
          )}
          <div className="d-flex flex-wrap align-items-center" style={{ gap: 8 }}>
            <button className="btn btn-primary" type="button" disabled={impBusy || (!imp.add.length && !imp.update.length && !imp.remove.length)} onClick={applyImport}>
              {impBusy && <span className="spinner-border spinner-border-sm mr-1" />}ยืนยัน: เพิ่ม {imp.add.length} · แก้ {imp.update.length}{imp.remove.length ? ` · ลบ ${imp.remove.length}` : ''}
            </button>
            <button className="btn btn-link" type="button" disabled={impBusy} onClick={() => { setImp(null); setImpReq(null) }}>ยกเลิก</button>
            {!imp.add.length && !imp.update.length && !imp.remove.length && <span className="small" style={MUTED}>ไม่มีอะไรต้องแก้ ข้อมูลในระบบตรงกับไฟล์แล้ว</span>}
          </div>
        </div>
      )}
      {impMsg && (
        <div className={`alert ${impMsg.ok ? 'alert-success' : 'alert-danger'} mt-3 mb-0`} role="status">
          {impMsg.text}
          {impMsg.errors && <ul className="mb-0 mt-2 small">{impMsg.errors.map((x, i) => <li key={i}>แถว {x.line} · {x.word}: {x.msg}</li>)}</ul>}
        </div>
      )}
    </div></div>

    <div className="d-flex align-items-center mb-4">
      <button className="btn btn-icon btn-circle btn-outline-primary" onClick={handleAddClick} aria-label="เพิ่มคำ"><i className="bi bi-plus-lg"></i></button>
      <span className="ml-3" style={MUTED}>{wordType} · {shown.length} คำ</span>
      <div className="ml-auto col-xs-12">
        <select className="custom-select" aria-label="เลือกคอร์ส" value={wordType} onChange={(evt) => { setWordType(evt.target.value); setImp(null); setImpReq(null) }}>
          <option>CUTEP</option>
          <option>TOEIC</option>
          <option>IELTS</option>
        </select>
      </div>
    </div>

    <div className="table-overflow">
      <table className="table">
        <thead className="thead-light">
          <tr className="text-center">
            <th scope="col">#</th>
            <th scope="col">Word</th>
            <th scope="col">POS</th>
            <th scope="col">Translation</th>
            <th scope="col">Synonym</th>
            <th scope="col">Types</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
        {shown.map((w, i) =>
          <tr key={i}>
            <th scope="row">{i + 1}</th>
            <td>{w.word}</td>
            <td>{w.pos}</td>
            <td>{w.translation}</td>
            <td>{w.synonym}</td>
            <td>{w.types.map((t, i) => <div key={i}><small>{t}</small></div> )}</td>
            <td>
              <button className="btn btn-xs btn-icon btn-circle btn-outline-warning m-1" onClick={handleEditClick(w)} aria-label={`แก้ ${w.word}`}>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-xs btn-icon btn-circle btn-outline-danger m-1" onClick={handleDeleteClick(w)} aria-label={`ลบ ${w.word}`}>
                <i className="bi bi-trash-fill"></i>
              </button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>

    <div id="modal-form" className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <WordForm word={editingWord} onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}