import Image from "next/image";
import Link from "next/link";

export default function Howto() {
  return (
    <div className="text-center">
      <h5>Welcome ENG ME UP Students</h5>
      <div className="d-flex my-4 text-howto">
        <p className="align-self-center">สำหรับการใช้งานครั้งแรก<br/><a className="text-primary" href="https://www.youtube.com/">กดรับชมวิธีการใช้งาน WORD ME UP ที่นี่ครับ</a></p>
      </div>
      <button className="btn btn-sm btn-success-gradient"><Link href="/main">เริ่มต้นใช้งาน</Link></button>
    </div>
  )
}
