import mongoose from 'mongoose'

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  pos: { type: String, required: true },
  translation: { type: String, required: true },
  synonym: { type: String },
  types: { type: [String], required: true },
})

export const Word = mongoose.models.Word || mongoose.model('Word', WordSchema)
