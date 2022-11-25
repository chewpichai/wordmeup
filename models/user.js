import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  courseType: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  numPerDay: { type: Number, default: 0 },
  numRounds: { type: Number, default: 0 },
  showHowto: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  words: [{
    word: { type: mongoose.ObjectId, ref: 'Word'},
    next: { type: Number },
    completed: { type: Boolean, default: false },
  }],
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
