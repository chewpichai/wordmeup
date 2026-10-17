import mongoose from 'mongoose'

// Let's Practice: เนื้อหาแบบฝึกที่แอดมินอัปโหลดเอง (Admin → Practice) 1 เอกสารต่อ 1 คอร์ส
// words = { "abduct": { s: "The gang planned to ___ ...", syn: "kidnap" } } · form = [{ id, w, s, o:[4], a:0-3, tip }]
// mode  = 'merge'   → ใช้ไฟล์ data/practice-content.json เป็นฐาน แล้วทับ/เพิ่ม/ลบ ตามที่อัปโหลด (ข้อเดียวกัน = id เดียวกัน)
//         'replace' → ใช้เนื้อหาในฐานข้อมูลอย่างเดียว (อัปโหลดแบบ "แทนที่ทั้งหมด") ไม่ดึงจากไฟล์อีก
// avoid = ["hinder|impede", ...] กลุ่มคำความหมายใกล้กันมาก (เก็บเป็นข้อความคั่นด้วย |) · ไม่มีค่า = ใช้ของไฟล์
const PracticeContentSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // CUTEP | TOEIC | IELTS (ตัวพิมพ์ใหญ่ ไม่มีขีด)
  label: { type: String },
  mode: { type: String, default: 'merge' },
  words: { type: Object, default: {} },
  form: { type: Array, default: [] },
  avoid: { type: [String], default: undefined },
  updatedBy: { type: String },
}, { minimize: false, timestamps: true })

export const PracticeContent = mongoose.models.PracticeContent || mongoose.model('PracticeContent', PracticeContentSchema)
