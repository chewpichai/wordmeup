import mongoose from 'mongoose'

// [v1.3] บันทึกการนำเข้าคลังคำจากไฟล์ (Admin → Word) · เก็บค่าเดิมไว้ ย้อนกลับได้
const WordImportLogSchema = new mongoose.Schema({
  by: { type: String },
  file: { type: String },
  created: { type: [mongoose.ObjectId], default: [] }, // คำที่เพิ่มใหม่
  updated: { type: Array, default: [] }, // [{ _id, before:{word,pos,translation,synonym,types}, after:{...} }]
  deleted: { type: Array, default: [] }, // คำซ้ำที่ลบ (เก็บทั้งแถว ใส่คืนได้ด้วย _id เดิม)
  undone: { type: Boolean, default: false },
}, { timestamps: true })

export const WordImportLog = mongoose.models.WordImportLog || mongoose.model('WordImportLog', WordImportLogSchema)
