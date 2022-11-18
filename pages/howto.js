import Image from "next/image";
import Link from "next/link";

export default function Howto() {
  return (
    <>
    <div className="embed-responsive embed-responsive-16by9 my-2">
      <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/ehrhk1lizM8" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div className="text-center">
      <button className="btn btn-sm btn-success-gradient"><Link href="/main">เริ่มต้นใช้งาน</Link></button>
    </div>
    </>
  )
}
