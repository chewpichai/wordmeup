import moment from "moment";
import { User, Word } from "models";
import { apiHandler } from "utils";

export default apiHandler({
  get: getList,
});

async function getList(req, res) {
  const { uid, status } = req.query;
  const user = await User.findById(uid);
  if (status === "completed") {
    const completedWordIds = user.words
      .filter((w) => w.completed)
      .map((w) => w.word);
    const words = await Word.find({ _id: { $in: completedWordIds } });
    const total = `${words.length}/${user.words.length}`;
    return res.json({ words, total });
  }
  const notCompletedWords = user.words.filter((w) => !w.completed);
  let reviseWordIds = notCompletedWords
    .filter((w) => user.numRounds >= w.next)
    .map((w) => w.word);
  const newWords = await Word.find({
    $and: [
      { _id: { $nin: user.words.map((w) => w.word) } },
      { types: user.courseType },
    ],
  });
  const shuffled = newWords.sort((a, b) => 0.5 - Math.random());
  if (
    reviseWordIds.length === 0 &&
    newWords.length === 0 &&
    notCompletedWords.length > 0
  ) {
    reviseWordIds = notCompletedWords.map((w) => w.word);
  }
  const reviseWords = await Word.find({ _id: { $in: reviseWordIds } });
  res.json([...shuffled.slice(0, user.numPerDay), ...reviseWords]);
}
