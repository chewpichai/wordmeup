// /practice/demo — เดโมสาธารณะ ไม่ต้อง login (ชุดตัวอย่าง CU-TEP 20 คำ) · ?tour=1 = เปิดทัวร์อัตโนมัติ
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { LetsPracticeHost } from 'components'
import { LP_VIEWPORT_DEFAULT, lpViewport } from 'libs/practice-version'

export default function PracticeDemo() {
  // v1.5: มือถือทุกขนาดแสดงเหมือนจอกว้าง 390px (ดู libs/practice-version.js)
  const [vp, setVp] = useState(LP_VIEWPORT_DEFAULT)
  useEffect(() => { setVp(lpViewport()) }, [])
  return (
    <>
      <Head>
        <title>ลองเล่น Let&apos;s Practice ฟรี · WORD ME UP</title>
        <meta name="description" content="ลองฝึกใช้ศัพท์ CU-TEP แบบเกม 6 ด่าน ฟรี ไม่ต้องสมัคร จาก WORD ME UP by ENG ME UP" />
        <meta name="viewport" key="viewport" content={vp} />
      </Head>
      <LetsPracticeHost mode="demo" />
    </>
  )
}
