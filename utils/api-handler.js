import { connectMongo } from 'libs'

export function apiHandler(handler) {
  return async (req, res) => {
    await connectMongo()
    const method = req.method.toLowerCase()

    // check handler supports HTTP method
    if (!handler[method])
      return res.status(405).end(`Method ${req.method} Not Allowed`)

    await handler[method](req, res)
  }
}
