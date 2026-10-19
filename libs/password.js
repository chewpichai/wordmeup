// [v1.3.1] ตรวจรหัสผ่านตอน login · ครูโจต้องการให้แอดมินดูรหัสนักเรียนได้ จึงเก็บรหัสแบบอ่านได้เหมือนระบบเดิม
// (เทียบแบบ timing-safe) · ยังอ่านรูปแบบ scrypt$… ได้ เผื่อบัญชีไหนเคยถูกเข้ารหัส (แอดมินตั้งรหัสใหม่แล้วจะกลับเป็นแบบอ่านได้)
// ใช้ฝั่ง server เท่านั้น
import crypto from 'crypto'

const KEYLEN = 32
const RE = /^scrypt\$[A-Za-z0-9+/=]{16,}\$[A-Za-z0-9+/=]{40,}$/

export const isHashed = (v) => typeof v === 'string' && RE.test(v)

function scrypt(password, salt) {
  return new Promise((resolve, reject) =>
    crypto.scrypt(String(password).normalize('NFC'), salt, KEYLEN, { N: 16384, r: 8, p: 1 }, (err, key) => (err ? reject(err) : resolve(key))))
}

// ตรวจรหัส: รหัสแบบอ่านได้ (ปกติ) หรือแบบ scrypt (ถ้ามี)
export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || typeof stored !== 'string' || !stored) return false
  if (isHashed(stored)) {
    const [, salt, hash] = stored.split('$')
    const want = Buffer.from(hash, 'base64')
    const got = await scrypt(password, Buffer.from(salt, 'base64'))
    return want.length === got.length && crypto.timingSafeEqual(want, got)
  }
  const a = Buffer.from(password)
  const b = Buffer.from(stored)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// รหัสใหม่ที่แอดมินตั้ง: อย่างน้อย 4 ตัว ไม่เกิน 100 ตัว (ระบบเดิมไม่มีกฎ จึงตั้งขั้นต่ำไว้ต่ำ)
export function checkNewPassword(p) {
  if (p === undefined || p === null || p === '') return 'ต้องใส่รหัสผ่าน'
  if (typeof p !== 'string') return 'รหัสผ่านต้องเป็นข้อความ'
  if (p.trim().length < 4) return 'รหัสผ่านต้องยาวอย่างน้อย 4 ตัว'
  if (p.length > 100) return 'รหัสผ่านยาวเกิน 100 ตัว'
  return ''
}
