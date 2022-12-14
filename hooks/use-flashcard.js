import axios from 'axios'
import { useEffect, useState } from 'react'
import { userService } from 'services'

export function useFlashCard() {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [nomore, setNomore] = useState(false)
  const [stat, setStat] = useState({})

  useEffect(() => {
    loadWords(userService.userValue)
  }, [])

  useEffect(() => {
    const subscription = userService.user.subscribe(loadWords)
    return () => subscription.unsubscribe()
  }, [])

  function loadWords(user) {
    if (!user?.numPerDay)
      return
    axios.get(`/api/user/${user._id}/word`)
      .then(({ data: words }) => {
        setNomore(words.length === 0)
        setWords(words)
      })
  }

  async function updateUserWord(next) {
    const data = {
      next: null,
      completed: false,
    }
    if (next === 'again') {
      words.push(words[currentIndex])
      return
    }
    if (next === 'clear')
      data.completed = true
    else
      data.next = next
    const uid = userService.userValue._id
    const wid = words[currentIndex]._id
    await axios.put(`/api/user/${uid}/word/${wid}`, data)
  }

  async function handleNext(next) {
    await updateUserWord(next)
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      handleFinish()
    }
  }

  async function handleFinish() {
    const uid = userService.userValue._id
    await axios.put(`/api/user/${uid}`, { finish: true })
    const res = await axios.get(`/api/user/${uid}/stat`)
    setStat(res.data)
    setFinished(true)
  }

  return {
    words,
    word: words[currentIndex],
    currentIndex,
    handleNext,
    finished,
    nomore,
    stat,
  }
} 