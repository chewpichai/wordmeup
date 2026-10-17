import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { userService } from 'services'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import s from 'styles/Landing.module.css'
import { lpIsNew } from 'libs/practice-version'

const LINE_URL = 'https://line.me/R/ti/p/@englishmeup'
const INPUT = { color: '#1F2340' } // ตัวอักษรในช่องกรอกให้อ่านง่าย (ธีมเดิมจางมาก)
const howto = (tab) => window.dispatchEvent(new CustomEvent('wmu:howto', { detail: tab }))

export default function Home() {
  // ---- ส่วน login เดิม (logic ไม่เปลี่ยน) ----
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required.'),
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState
  const router = useRouter();

  // [Let's Practice] กลับไปหน้าที่ตั้งใจจะเปิด (เช่น /practice?tour=1) หลัง login · รับเฉพาะ path ในเว็บนี้
  function backTo(user) {
    const r = router.query.returnUrl
    if (typeof r !== 'string' || !/^\/(?![\/\\])[^\s\\]*$/.test(r) || r === '/' || r.startsWith('/?')) return ''
    if (r.startsWith('/admin') && !user.isAdmin) return ''
    return r
  }
  // ข้อความ error จาก server (ภาษาอังกฤษ) → ภาษาไทยที่นักเรียนเข้าใจ
  const TH_ERR = {
    'No username or password.': 'username หรือ password ไม่ถูกต้อง ลองใหม่อีกครั้งครับ',
    'Not in learning period.': 'บัญชีนี้ไม่อยู่ในช่วงเวลาเรียน (หมดอายุแล้ว หรือยังไม่ถึงวันเริ่ม) ติดต่อ LINE @englishmeup ได้เลยครับ',
  }
  const [notice, setNotice] = useState('')
  const [isNew, setIsNew] = useState(false) // ป้าย NEW: ดู libs/practice-version.js
  useEffect(() => {
    setIsNew(lpIsNew())
    try {
      const m = sessionStorage.getItem('wmu_auth_msg')
      if (m) {
        sessionStorage.removeItem('wmu_auth_msg')
        setNotice(m === 'period'
          ? 'บัญชีนี้หมดช่วงเวลาเรียนแล้ว ติดต่อ LINE @englishmeup ได้เลยครับ'
          : 'หมดเวลาเข้าสู่ระบบแล้ว กรุณาเข้าสู่ระบบใหม่อีกครั้งครับ (ผล Let\'s Practice ที่ยังไม่ได้บันทึก ระบบจะส่งให้เองหลังเข้าสู่ระบบ)')
      }
    } catch (e) {}
  }, [])

  function onSubmit(data) {
    return userService.login(data)
      .then((user) => {
        const r = backTo(user)
        if (r)
          return router.push(r)
        if (user.isAdmin)
          return router.push('/admin/user')
        router.push('/main')
      })
      .catch((err) => {
        const m = err.response?.data?.message || err.response?.data
        alert((typeof m === 'string' && TH_ERR[m]) || (err.response ? 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้งครับ' : 'เชื่อมต่อไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่ครับ'))
      })
  }

  return (
    <main className={s.page}>
      {isNew && (
        <div className={s.news} role="region" aria-label="ประกาศ">
          <span className={s.tag}>NEW</span>
          <span>WORD ME UP เวอร์ชันใหม่ เพิ่ม <b>Let&apos;s Practice</b> ฝึกใช้ศัพท์แบบเกม</span>
          <Link href="/practice/demo"><a>ลองเล่นฟรี</a></Link> · <button type="button" onClick={() => howto('lp')}>ดูวิธีใช้</button>
        </div>
      )}

      <div className={s.grid}>
        <div className={s.side}>
        <form className={s.login} onSubmit={handleSubmit(onSubmit)} aria-labelledby="lh">
          <h1 id="lh">เข้าสู่ระบบ</h1>
          {notice && <p className={s.notice} role="alert">{notice}</p>}
          <p>ใช้ username / password ที่ได้รับทางอีเมล</p>
          <div className="form-group">
            <input
              type="text" placeholder="Username" aria-label="Username" autoComplete="username" style={INPUT}
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              { ...register('username') }
            />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </div>
          <div className="form-group">
            <input
              type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" style={INPUT}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              { ...register('password') }
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>
          <button type="submit" className={`btn btn-primary pill w-100 ${s.loginBtn}`} disabled={formState.isSubmitting}>
            {formState.isSubmitting && <div className="spinner-border spinner-border-sm mr-1"/>}
            Login
          </button>
          <p className={s.contact}>ยังไม่มีบัญชี? สนใจใช้งาน <a href={LINE_URL} target="_blank" rel="noopener noreferrer">ติดต่อ LINE @englishmeup</a></p>
        </form>
        <img className={`${s.art} ${s.artSide}`} src="/practice/img/train.webp" alt="นักเรียน ENG ME UP ซ้อมสู้ข้อสอบ TEST โดยมีครูโจคอยดู" width="720" height="402" />
        </div>

        <section className={s.feat} aria-labelledby="fh">
          <h2 id="fh">ใน WORD ME UP มี 2 ส่วน ใช้คู่กัน</h2>
          <div className={s.cards}>
            <article className={s.fc}>
              <div className={s.vis} aria-hidden="true">
                <div className={s.flashbox}>
                  <div className={s.flash}><img src="/bg-card.png" alt="" /><b>abduct</b><small>(v.) · กดพลิกดูความหมาย</small></div>
                  <div className={s.lvls}><span>ทวนวันนี้</span><span>อีก 1 วัน</span><span>อีก 3 วัน</span><span>อีก 7 วัน</span></div>
                </div>
              </div>
              <div className={s.txt}>
                <h3><span className={s.num}>1</span>การ์ดท่องศัพท์ <small>Intelligent Flashcard</small></h3>
                <p>ท่องวันละ 5–7 คำ นึกความหมายแล้วพลิกการ์ด ฟังเสียงอ่าน แล้วเลือกความยาก ระบบจะนัดทวนให้เองตามความจำของคุณ</p>
                <div className={s.acts}><button className={`${s.btn} ${s.btnG}`} type="button" onClick={() => howto('cards')}>ดูวิธีใช้การ์ด</button></div>
              </div>
            </article>
            <article className={s.fc}>
              <div className={`${s.vis} ${s.visLp}`} aria-hidden="true">
                <img className={s.lpcards} src="/practice/landing/lp_cards.webp" alt="" width="640" height="438" />
              </div>
              <div className={s.txt}>
                <h3><span className={`${s.num} ${s.numLp}`}>2</span>Let&apos;s Practice {isNew && <span className={s.new}>ใหม่</span>}</h3>
                <p>ฝึกใช้คำที่ท่องแล้ว 6 ด่านแบบเกม เก็บดาว เก็บคำเข้าสมุดคำศัพท์ ตอบผิดได้ เดี๋ยวคำนั้นวนกลับมาให้ลองใหม่</p>
                <div className={s.chips}><span>จับคู่</span><span>แยกชนิดคำ</span><span>คำเหมือน</span><span>เติมประโยค</span><span>รูปคำ</span><span>บอส</span></div>
                <div className={s.acts}>
                  <Link href="/practice/demo"><a className={`${s.btn} ${s.btnP}`}>ลองเล่นฟรี (ไม่ต้อง login)</a></Link>
                  <button className={`${s.btn} ${s.btnG}`} type="button" onClick={() => howto('lp')}>ดูวิธีใช้</button>
                </div>
              </div>
            </article>
          </div>
          <div className={s.flow} aria-label="ลำดับการใช้งานทุกวัน">
            <b style={{ marginRight: 4 }}>ทุกวัน:</b><span>ท่องการ์ด</span><i>→</i><span className={s.flowLp}>ฝึกใน Let&apos;s Practice</span><i>→</i><span>ทวนใน My Completed Words</span>
          </div>
        </section>
      </div>
      <img className={`${s.art} ${s.artBottom}`} src="/practice/img/train.webp" alt="" width="720" height="402" loading="lazy" />
    </main>
  )
}
