import mongoose from 'mongoose'

// บันทึกการแก้คลังคำจากหน้า Admin → Practice (เก็บค่าเดิมไว้ ย้อนกลับได้)
const WordFixLogSchema = new mongoose.Schema({
  by: { type: String },
  items: { type: Array, default: [] }, // [{ _id, type, before:{word,pos,translation,synonym}, after:{...} }]
  undone: { type: Boolean, default: false },
}, { timestamps: true })

export const WordFixLog = mongoose.models.WordFixLog || mongoose.model('WordFixLog', WordFixLogSchema)
