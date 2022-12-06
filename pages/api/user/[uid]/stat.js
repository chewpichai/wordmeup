import { User } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  get: getStat,
});


async function getStat(req, res) {
  const user = await User.findById(req.query.uid)
  res.json({
    'totalWords': user.words.length,
    'completed': user.words.filter(w => w.completed).length
  })
}
