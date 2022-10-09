import mongoose from 'mongoose'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
let connected = false

export async function connectMongo() {
  if (connected)
    return
  const db = await mongoose.connect(serverRuntimeConfig.mongoUrl)
  connected = db.connections[0].readyState
  console.log('db connect =', connected)
}
