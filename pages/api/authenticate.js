const jwt = require('jsonwebtoken')
import getConfig from 'next/config'
import { User } from 'models'
import { apiHandler } from 'utils'

const { serverRuntimeConfig } = getConfig()

export default apiHandler({
  post: authenticate
})

async function authenticate(req, res) {
  const user = await User.findOne(req.body)
  if (!user)
    return res.status(403).end('No username or password.')
  const now = new Date()
  if (!user.isAdmin && (user.startDate > now || now > user.endDate))
    return res.status(403).end('Not in learning period.')
  const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' })
  const { password, words, ...rest } = user._doc
  return res.status(200).json({ ...rest, token })
}
