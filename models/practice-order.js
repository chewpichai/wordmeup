import mongoose from 'mongoose'

// Let's Practice: ลำดับคำแบบคงที่ของแต่ละคอร์ส (ใช้แบ่งชุด) 1 เอกสารต่อ 1 คอร์ส
// ids  = _id ของคำ เรียงตามตำแหน่ง (ครั้งแรกเรียง a→z · คำที่เพิ่มทีหลังต่อท้ายเสมอ · ตำแหน่งเดิมไม่ขยับ)
// base = จำนวนตำแหน่งตอนสร้างลำดับครั้งแรก (ชุดที่ตัดจากช่วงนี้จะไม่เปลี่ยนอีก)
const PracticeOrderSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // CUTEP | TOEIC | IELTS
  ids: { type: [String], default: undefined },
  base: { type: Number, default: 0 },
}, { timestamps: true })

export const PracticeOrder = mongoose.models.PracticeOrder || mongoose.model('PracticeOrder', PracticeOrderSchema)
