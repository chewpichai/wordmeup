import { User, Word } from 'models'
import { apiHandler } from 'utils'

export default apiHandler({
  get: getStat,
});


async function getStat(req, res) {
  const user = await User.findById(req.query.uid)
  const typedWords = await Word.find({ types: user.courseType }).count()
  const completed = user.words.filter(w => w.completed).length
  res.json({
    'remain': typedWords - completed,
    completed
  })
}
