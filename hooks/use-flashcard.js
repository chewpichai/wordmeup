import axios from 'axios'
import { useEffect, useState } from 'react'
import { userService } from 'services'

export function useFlashCard() {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    loadWords(userService.userValue)
  }, [])

  useEffect(() => {
    const subscription = userService.user.subscribe(loadWords)
  }, [])

  function loadWords(user) {
    if (!user?.numPerDay)
      return
    axios.get(`/api/user/${user._id}/word`)
      .then(({ data: words }) => setWords(words))
  }

  async function updateUserWord(date) {
    const data = {
      next: null,
      completed: false,
    }
    if (date === 'again') {
      words.push(words[currentIndex])
      return
    }
    if (date === 'clear')
      data.completed = true
    else
      data.next = date
    const uid = userService.userValue._id
    const wid = words[currentIndex]._id
    await axios.put(`/api/user/${uid}/word/${wid}`, data)
  }

  async function handleNext(date) {
    if (currentIndex < words.length - 1) {
      await updateUserWord(date)
      setCurrentIndex(i => i + 1)
    } else {
      setFinished(true)
    }
  }

  return {
    words,
    word: words[currentIndex],
    currentIndex,
    handleNext,
    finished,
  }
} 