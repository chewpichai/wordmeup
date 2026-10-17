import mongoose from 'mongoose'

// Let's Practice: ความคืบหน้าของผู้เรียน 1 เอกสารต่อ 1 คน (ไม่แตะ User เดิม)
// sets = { "<TYPE>_<no>": { stars: { s1: 0-3, ..., boss: 0-3 }, got: ["abduct", ...] } }
// xpIds = รหัสของ XP แต่ละก้อนที่บวกไปแล้ว (ส่งซ้ำ/เน็ตหลุดแล้วส่งใหม่ ไม่บวกซ้ำ)
const PracticeProgressSchema = new mongoose.Schema({
  user: { type: mongoose.ObjectId, ref: 'User', required: true, unique: true },
  xp: { type: Number, default: 0 },
  xpIds: { type: [String], default: undefined, select: false },
  toured: { type: Boolean, default: false },
  seen: { type: Object, default: {} },
  sets: { type: Object, default: {} },
}, { minimize: false, timestamps: true })

export const PracticeProgress = mongoose.models.PracticeProgress || mongoose.model('PracticeProgress', PracticeProgressSchema)
