// /practice/demo — เดโมสาธารณะ ไม่ต้อง login (ชุดตัวอย่าง CU-TEP 20 คำ) · ?tour=1 = เปิดทัวร์อัตโนมัติ
import Head from 'next/head'
import { LetsPracticeHost } from 'components'

export default function PracticeDemo() {
  return (
    <>
      <Head>
        <title>ลองเล่น Let&apos;s Practice ฟรี · WORD ME UP</title>
        <meta name="description" content="ลองฝึกใช้ศัพท์ CU-TEP แบบเกม 6 ด่าน ฟรี ไม่ต้องสมัคร จาก WORD ME UP by ENG ME UP" />
      </Head>
      <LetsPracticeHost mode="demo" />
    </>
  )
}
