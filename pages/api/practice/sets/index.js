// GET /api/practice/sets — รายการชุดของผู้เรียน + ดาว + ชุดไหนเปิดแล้ว
import { PracticeProgress } from 'models'
import { apiHandler, withAuth } from 'utils'
import { getSets, loadContent, labelOf, availability, setProgress, isUnlocked, isPassed, resolveType, typeKey, STAGE_IDS } from 'libs/practice'

export default apiHandler({ get: withAuth(list) })

async function list(req, res) {
  const type = resolveType(req)
  const chunks = await getSets(type)
  const C = await loadContent(type)
  const prog = await PracticeProgress.findOne({ user: req.me._id }).lean()
  const sets = chunks.map((chunk, i) => {
    const no = i + 1
    const p = setProgress(prog, type, no)
    const av = availability(chunk)
    const avail = STAGE_IDS.filter((id) => av[id])
    return {
      no,
      first: chunk.length ? String(chunk[0].word).trim() : '',
      last: chunk.length ? String(chunk[chunk.length - 1].word).trim() : '',
      count: chunk.length,
      stars: avail.reduce((n, id) => n + (p.stars[id] || 0), 0),
      maxStars: avail.length * 3,
      passed: isPassed(prog, type, no, chunk),
      unlocked: isUnlocked(prog, type, no, req.me.isAdmin, chunks),
    }
  })
  res.json({ type: typeKey(type), label: C.label || labelOf(type), total: chunks.length, sets })
}
