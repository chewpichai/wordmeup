import { connectMongo } from 'libs'

export function apiHandler(handler) {
  return async (req, res) => {
    const method = req.method.toLowerCase()

    // check handler supports HTTP method
    if (!handler[method])
      return res.status(405).end(`Method ${req.method} Not Allowed`)

    // [Let's Practice / security patch] ข้อมูลผิดรูปแบบ → 400 · error อื่น → 500 แบบ JSON (ไม่ส่งรายละเอียดภายในให้เบราว์เซอร์)
    try {
      await connectMongo()
      await handler[method](req, res)
    } catch (e) {
      if (res.headersSent) return
      if (e && (e.name === 'CastError' || e.name === 'ValidationError' || e.name === 'StrictModeError' || e.name === 'BSONError' || e.name === 'BSONTypeError'))
        return res.status(400).json({ message: 'ข้อมูลไม่ถูกต้อง (Invalid data)' })
      console.error('API error', req.method, (req.url || '').split('?')[0], e && e.message)
      return res.status(500).json({ message: 'ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง (Server error)' })
    }
  }
}
