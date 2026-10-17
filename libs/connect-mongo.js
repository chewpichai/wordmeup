import mongoose from 'mongoose'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
let connected = false

export async function connectMongo() {
  if (connected)
    return
  // ใช้ค่า env ถ้ามี (แนะนำ) ไม่งั้นใช้ค่าเดิมใน next.config.js
  const db = await mongoose.connect(process.env.MONGO_URL || serverRuntimeConfig.mongoUrl)
  connected = db.connections[0].readyState
  console.log('db connect =', connected)
}
