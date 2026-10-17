// GET /api/practice/sets/:no — คำศัพท์ + เนื้อหาของชุดนั้น + ความคืบหน้า
import { PracticeProgress } from 'models'
import { apiHandler, withAuth } from 'utils'
import { getSets, loadContent, buildSet, setProgress, isUnlocked, resolveType } from 'libs/practice'

export default apiHandler({ get: withAuth(getOne) })

async function getOne(req, res) {
  const type = resolveType(req)
  const no = /^\d+$/.test(String(req.query.no)) ? parseInt(req.query.no, 10) : NaN
  const chunks = await getSets(type)
  if (!(no >= 1 && no <= chunks.length)) return res.status(404).json({ message: 'Set not found.' })
  const C = await loadContent(type)
  const prog = await PracticeProgress.findOne({ user: req.me._id }).lean()
  if (!isUnlocked(prog, type, no, req.me.isAdmin, chunks)) return res.status(403).json({ message: 'ผ่านบอสของชุดก่อนหน้าก่อนนะครับ' })
  const { authored, ...set } = buildSet(type, no, chunks[no - 1], chunks.length, C)
  const p = setProgress(prog, type, no)
  res.json({
    set,
    progress: { xp: prog?.xp || 0, toured: !!prog?.toured, seen: prog?.seen || {}, stars: p.stars, got: p.got },
  })
}
