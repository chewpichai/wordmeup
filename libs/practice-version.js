// Let's Practice: เลขเวอร์ชัน "ที่เดียว" ของทั้งระบบ
// ใช้ใน: หน้าเกม (footer "Let's Practice v…" + window.LetsPractice.version, ส่งผ่าน ?v= ตอนโหลดสคริปต์)
//        หน้า Admin → Practice ("หน้าแอดมิน v… · server v…") และ API /api/practice/admin/status
// เปลี่ยนไฟล์ใน public/practice/ เมื่อไหร่ ให้เปลี่ยนเลขนี้ด้วย (เบราว์เซอร์จะโหลดไฟล์ใหม่ ไม่ใช้ของเก่าใน cache)
// ไฟล์นี้ไม่มี import อะไรเลย จึงใช้ได้ทั้งฝั่ง server และฝั่งเบราว์เซอร์
export const LP_VERSION = '1.3.1'

// ป้าย NEW ของ Let's Practice (เมนู / หน้าแรก / How to Use)
// แสดง 30 วันนับจากวันแรกที่เครื่องนั้นเห็น และไม่เกินวันที่ NEW_UNTIL (หลังวันนี้ไม่มีใครเห็นป้าย NEW แล้ว)
const NEW_DAYS = 30
const NEW_UNTIL = '2027-03-01T00:00:00+07:00'
const NEW_KEY = 'wmu_lp_new_since'
export function lpIsNew() {
  const now = Date.now()
  if (now >= Date.parse(NEW_UNTIL)) return false
  try {
    let since = parseInt(localStorage.getItem(NEW_KEY), 10)
    if (!since || since > now) {
      since = now
      localStorage.setItem(NEW_KEY, String(now))
    }
    return now - since < NEW_DAYS * 864e5
  } catch (e) {
    return true
  }
}
