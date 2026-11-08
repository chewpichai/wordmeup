// /practice — Let's Practice สำหรับนักเรียนที่ login แล้ว (ศัพท์ตาม courseType ของนักเรียน)
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { LetsPracticeHost } from 'components'
import { LP_VIEWPORT_DEFAULT, lpViewport } from 'libs/practice-version'

export default function Practice() {
  // v1.5: มือถือทุกขนาดแสดงเหมือนจอกว้าง 390px (ดู libs/practice-version.js)
  const [vp, setVp] = useState(LP_VIEWPORT_DEFAULT)
  useEffect(() => { setVp(lpViewport()) }, [])
  return (
    <>
      <Head>
        <title>Let&apos;s Practice · WORD ME UP</title>
        <meta name="viewport" key="viewport" content={vp} />
      </Head>
      <LetsPracticeHost mode="app" />
    </>
  )
}
