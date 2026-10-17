// Let's Practice: โหลดเกม (public/practice/letspractice.js) แล้ว mount ลงกล่องนี้
// mode="app"  = นักเรียนที่ login แล้ว (บันทึกผลลงฐานข้อมูล)
// mode="demo" = เดโมสาธารณะ ไม่ต้อง login ไม่บันทึกผล
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { userService } from 'services'
import { LP_VERSION } from 'libs/practice-version'

const VER = LP_VERSION // ใส่ท้ายไฟล์ ?v= ให้เบราว์เซอร์โหลดไฟล์ใหม่ทุกครั้งที่เปลี่ยนเวอร์ชัน (เกมอ่านเลขเวอร์ชันจากตรงนี้)
const MUTED = { color: '#5E6170' } // เทาที่อ่านออก (คอนทราสต์ ≥ 4.5:1) ไม่ใช้ .text-muted ของธีมหลัก

// รอ CSS โหลดเสร็จก่อนแสดงเกม (เน็ตช้า จะไม่เห็นหน้าเพี้ยน รูป/ไอคอนใหญ่เต็มจอ)
function loadCss() {
  const href = `/practice/letspractice.css?v=${VER}`
  const has = [...document.querySelectorAll('link[rel="stylesheet"]')].find((l) => l.getAttribute('href') === href)
  if (has && has.sheet) return Promise.resolve()
  return new Promise((resolve) => {
    const l = has || document.createElement('link')
    const done = () => resolve()
    l.addEventListener('load', done)
    l.addEventListener('error', done)
    setTimeout(done, 8000) // ไม่ค้างตลอดไป
    if (!has) {
      l.rel = 'stylesheet'
      l.href = href
      document.head.appendChild(l)
    }
  })
}

function loadScript() {
  if (window.LetsPractice) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = `/practice/letspractice.js?v=${VER}`
    s.onload = resolve
    s.onerror = () => reject(new Error('load failed'))
    document.body.appendChild(s)
  })
}

export function LetsPracticeHost({ mode = 'app' }) {
  const ref = useRef(null)
  const appRef = useRef(null)
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // ออกจากหน้านี้ (กดเมนูอื่น) ระหว่างที่ผลยังบันทึกไม่เสร็จ → ส่งทันที แล้วส่งต่อเองเบื้องหลัง/ครั้งหน้าที่เปิด (ผลเก็บในเครื่องแล้ว ไม่หาย)
  useEffect(() => {
    const flush = () => { const a = appRef.current; if (a && a.pending && a.pending()) a.flush() }
    // กดเมนูอื่นระหว่างอยู่ในด่าน: ใช้ entry ของด่านแทนการเพิ่มหน้าใหม่ (กด Back จากหน้าใหม่ครั้งเดียว = กลับแผนที่ด่าน)
    const noExtraEntry = () => {
      const a = appRef.current
      if (!a || !a.inStage || !a.inStage()) return
      a.dropStage()
      const h = window.history
      const push = h.pushState
      h.pushState = function (state, title, url) { h.pushState = push; return h.replaceState(state, title, url) }
      setTimeout(() => { if (h.pushState !== push) h.pushState = push }, 0)
    }
    router.events.on('routeChangeStart', flush)
    router.events.on('beforeHistoryChange', noExtraEntry)
    return () => {
      router.events.off('routeChangeStart', flush)
      router.events.off('beforeHistoryChange', noExtraEntry)
    }
  }, [router.events])

  useEffect(() => {
    if (!router.isReady) return
    let app = null
    let gone = false
    const autoTour = router.query.tour === '1'
    // แอดมินดูคอร์สอื่นได้: /practice?type=TOEIC
    const type = typeof router.query.type === 'string' ? router.query.type : ''
    const qs = type ? `?type=${encodeURIComponent(type)}` : ''
    const me = userService.userValue
    const uid = me && me._id ? String(me._id) : ''
    const common = { assetBase: '/practice/img/', showLogo: false, showCopyright: false, embedded: true, autoTour, loggedIn: !!uid }

    // ปุ่ม Back ระหว่างเล่น → เกมพากลับแผนที่ด่านเอง (Next.js ไม่ต้องเปลี่ยนหน้า)
    router.beforePopState((st) => !((app && app.ownsPop && app.ownsPop()) || (st && st.lpStage)))

    // บันทึกผล: เก็บคิวไว้ในเครื่อง (แยกตามผู้ใช้) · ส่งเฉพาะเมื่อยังเป็นผู้ใช้คนเดิม (กันผลไปลงบัญชีคนอื่นถ้าเปลี่ยนบัญชี)
    const storeKey = uid ? `lp_pending_${uid}${type ? `_${type.toUpperCase().replace(/[^A-Z0-9]/g, '')}` : ''}` : ''
    const onSave = (p) => {
      if (String(userService.userValue?._id || '') !== uid) return Promise.reject({ lpUserChanged: true })
      return axios.put(`/api/practice/progress${qs}`, p, { lpKeep401: true }).then((r) => r.data)
    }

    async function boot() {
      await Promise.all([loadScript(), loadCss()])
      if (mode === 'demo') {
        // ชุดเดโม = ชุดที่ 1 ของแอปจริง (จากคลังคำ) · เรียกไม่ได้ให้ใช้ไฟล์สำรอง demo-set.json
        const set = await axios.get('/api/practice/demo').then((r) => r.data.set)
          .catch(() => axios.get(`/practice/demo-set.json?v=${VER}`).then((r) => r.data))
        if (gone) return
        app = window.LetsPractice.mount(ref.current, { ...common, mode: 'demo', set })
        appRef.current = app
        setLoading(false)
        return
      }
      // ผลที่ค้างส่งจากครั้งก่อน (เน็ตหลุด/ออกจากหน้า/หมดเวลา login) ส่งก่อน แล้วค่อยโหลดรายการชุด (ไม่รอเกิน 5 วินาที)
      if (storeKey) await window.LetsPractice.flushStored(storeKey, onSave, 5000)
      const { data: list } = await axios.get(`/api/practice/sets${qs}`)
      if (!list.sets.length) throw new Error('empty')
      // เปิดชุดล่าสุดที่ยังไม่ผ่าน (ถ้าผ่านหมดแล้ว เปิดชุดสุดท้าย)
      const open = list.sets.filter((s) => s.unlocked)
      const cur = open.find((s) => !s.passed) || open[open.length - 1] || list.sets[0]
      const { data } = await axios.get(`/api/practice/sets/${cur.no}${qs}`)
      if (gone) return
      app = window.LetsPractice.mount(ref.current, {
        ...common,
        mode: 'app',
        set: data.set,
        progress: data.progress,
        sets: list.sets,
        isAdmin: !!me?.isAdmin,
        storeKey,
        loadSet: (no) => axios.get(`/api/practice/sets/${no}${qs}`).then((r) => r.data),
        onSave,
        // หมดเวลาเข้าสู่ระบบระหว่างเล่น: ผลเก็บไว้ในเครื่องแล้ว → พาไปหน้า login แล้วกลับมาที่นี่
        onAuthLost: (code) => userService.expire(code),
      })
      appRef.current = app
      setLoading(false)
    }

    boot().catch((e) => {
      if (gone) return
      setLoading(false)
      setError(e.message === 'empty' ? 'ยังไม่มีคำศัพท์สำหรับคอร์สนี้ ติดต่อแอดมินได้เลยครับ' : 'โหลด Let\'s Practice ไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้งครับ')
    })
    return () => {
      gone = true
      router.beforePopState(() => true)
      if (app) app.destroy()
      appRef.current = null
    }
  }, [router.isReady, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <link rel="stylesheet" href={`/practice/letspractice.css?v=${VER}`} />
      </Head>
      {loading && !error && <p className="text-center py-5" style={MUTED} role="status">กำลังโหลด Let&apos;s Practice…</p>}
      {error && <div className="alert alert-warning text-center">{error}</div>}
      <div ref={ref} />
    </>
  )
}
