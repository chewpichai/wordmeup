// /practice — Let's Practice สำหรับนักเรียนที่ login แล้ว (ศัพท์ตาม courseType ของนักเรียน)
import Head from 'next/head'
import { LetsPracticeHost } from 'components'

export default function Practice() {
  return (
    <>
      <Head><title>Let&apos;s Practice · WORD ME UP</title></Head>
      <LetsPracticeHost mode="app" />
    </>
  )
}
